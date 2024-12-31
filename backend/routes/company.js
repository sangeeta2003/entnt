const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Get all companies with pagination and filters
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status;
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const query = {};
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') },
        { emails: new RegExp(search, 'i') }
      ];
    }
    if (status) {
      query.status = status;
    }

    const companies = await Company.find(query)
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('createdBy', 'name email');

    const total = await Company.countDocuments(query);

    res.json({
      companies,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Error fetching companies' });
  }
});

// Get single company
router.get('/:id', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching company' });
  }
});

// Create company (admin only)
router.post('/', [auth, isAdmin], async (req, res) => {
  try {
    console.log('Creating company with user:', {
      userId: req.user._id,
      userRole: req.user.role,
      userName: req.user.name
    });

    // Convert number to string for periodicity if needed
    const companyData = {
      ...req.body,
      communicationPeriodicity: req.body.communicationPeriodicity.toString(),
      createdBy: req.user._id
    };

    const company = new Company(companyData);

    // Calculate next communication date based on periodicity
    const now = new Date();
    const periodicity = parseInt(company.communicationPeriodicity) || 30; // default to 30 if invalid

    // Set next communication date
    company.nextCommunication = new Date(now.getTime() + periodicity * 24 * 60 * 60 * 1000);

    await company.save();
    res.status(201).json(company);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(400).json({ 
      message: 'Error creating company',
      error: error.message 
    });
  }
});

// Update company (admin only)
router.put('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Update fields
    Object.assign(company, req.body);

    // Recalculate next communication if periodicity changed
    if (req.body.communicationPeriodicity) {
      const now = new Date();
      switch (company.communicationPeriodicity) {
        case 'weekly':
          company.nextCommunication = new Date(now.setDate(now.getDate() + 7));
          break;
        case 'biweekly':
          company.nextCommunication = new Date(now.setDate(now.getDate() + 14));
          break;
        case 'monthly':
          company.nextCommunication = new Date(now.setMonth(now.getMonth() + 1));
          break;
        case 'quarterly':
          company.nextCommunication = new Date(now.setMonth(now.getMonth() + 3));
          break;
        case 'annually':
          company.nextCommunication = new Date(now.setFullYear(now.getFullYear() + 1));
          break;
      }
    }

    await company.save();
    res.json(company);
  } catch (error) {
    res.status(400).json({ message: 'Error updating company' });
  }
});

// Delete company (admin only)
router.delete('/:id', [auth, isAdmin], async (req, res) => {
  try {
    console.log('Delete request for company:', req.params.id);
    
    if (!req.params.id) {
      return res.status(400).json({ message: 'Company ID is required' });
    }

    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    await company.deleteOne();
    console.log('Company deleted successfully:', req.params.id);
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ 
      message: 'Error deleting company',
      error: error.message 
    });
  }
});

// Get upcoming communications
router.get('/communications/upcoming', auth, async (req, res) => {
  try {
    const upcoming = await Company.find({
      nextCommunication: { 
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
      }
    })
    .sort({ nextCommunication: 1 })
    .populate('createdBy', 'name email');

    res.json(upcoming);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming communications' });
  }
});

module.exports = router; 