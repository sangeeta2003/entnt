const express = require('express');
const router = express.Router();
const Communication = require('../models/Communication');
const Company = require('../models/Company');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Get dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const query = {};
    if (req.user.role !== 'admin') {
      query.createdBy = req.user._id;
    }

    const communications = await Communication.find(query)
      .populate('company', 'name')
      .populate('createdBy', 'name')
      .sort('-date');

    // Process the data for dashboard
    const data = {
      totalCommunications: communications.length,
      byStatus: communications.reduce((acc, comm) => {
        acc[comm.status] = (acc[comm.status] || 0) + 1;
        return acc;
      }, {}),
      byType: communications.reduce((acc, comm) => {
        acc[comm.type] = (acc[comm.type] || 0) + 1;
        return acc;
      }, {}),
      recentCommunications: communications.slice(0, 10).map(comm => ({
        id: comm._id,
        type: comm.type,
        company: comm.company.name,
        status: comm.status,
        date: comm.date,
        createdBy: comm.createdBy.name
      }))
    };

    res.json(data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Create new communication
router.post('/', auth, async (req, res) => {
  try {
    const communication = new Communication({
      ...req.body,
      createdBy: req.user._id,
      updatedBy: req.user._id
    });

    await communication.save();
    
    const populatedComm = await communication.populate([
      { path: 'company', select: 'name' },
      { path: 'communicationMethod', select: 'name' }
    ]);

    res.status(201).json(populatedComm);
  } catch (error) {
    console.error('Error creating communication:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update communication status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const communication = await Communication.findById(req.params.id);

    if (!communication) {
      return res.status(404).json({ message: 'Communication not found' });
    }

    communication.status = status;
    if (status === 'completed') {
      communication.completedDate = new Date();
    }
    communication.updatedBy = req.user._id;

    await communication.save();
    res.json(communication);
  } catch (error) {
    console.error('Error updating communication status:', error);
    res.status(400).json({ message: error.message });
  }
});

// Toggle highlight override
router.patch('/:id/highlight', auth, async (req, res) => {
  try {
    const communication = await Communication.findById(req.params.id);

    if (!communication) {
      return res.status(404).json({ message: 'Communication not found' });
    }

    communication.highlightOverride = !communication.highlightOverride;
    communication.updatedBy = req.user._id;

    await communication.save();
    res.json(communication);
  } catch (error) {
    console.error('Error toggling highlight override:', error);
    res.status(400).json({ message: error.message });
  }
});

// Helper function to calculate status
function calculateStatus(communication) {
  if (!communication) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const scheduledDate = new Date(communication.scheduledDate);
  scheduledDate.setHours(0, 0, 0, 0);

  if (scheduledDate < today) return 'overdue';
  if (scheduledDate.getTime() === today.getTime()) return 'due';
  return 'upcoming';
}

// Get notifications
router.get('/notifications', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get overdue communications
    const overdue = await Communication.find({
      scheduledDate: { $lt: today },
      status: 'pending'
    })
    .populate('company', 'name')
    .sort({ scheduledDate: 1 });

    // Get communications due today
    const dueToday = await Communication.find({
      scheduledDate: {
        $gte: today,
        $lt: tomorrow
      },
      status: 'pending'
    })
    .populate('company', 'name')
    .sort({ scheduledDate: 1 });

    res.json({
      overdue,
      dueToday
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// Schedule a communication
router.post('/schedule', auth, async (req, res) => {
  try {
    const { companyId, type, scheduledDate, description, status = 'pending' } = req.body;

    console.log('Received request body:', req.body); // Debug log

    // Validate required fields
    if (!companyId || !type || !scheduledDate) {
      return res.status(400).json({ 
        message: 'Company, type, and scheduled date are required',
        received: { companyId, type, scheduledDate }
      });
    }

    // Verify company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Create new communication
    const communication = new Communication({
      company: companyId,
      type,
      scheduledDate: new Date(scheduledDate),
      description: description || '',
      status,
      createdBy: req.user._id
    });

    console.log('Creating communication:', communication); // Debug log

    await communication.save();

    // Populate company and user details
    await communication.populate([
      { path: 'company', select: 'name' },
      { path: 'createdBy', select: 'name' }
    ]);

    console.log('Communication saved successfully:', communication); // Debug log

    res.status(201).json(communication);
  } catch (error) {
    console.error('Error scheduling communication:', error);
    
    // Send more detailed error information
    res.status(500).json({ 
      message: 'Error scheduling communication',
      error: error.message,
      details: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : null
    });
  }
});

module.exports = router; 