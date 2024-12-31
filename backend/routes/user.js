const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Company = require('../models/Company');
const Communication = require('../models/Communication');

// Get dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const companies = await Company.aggregate([
      {
        $lookup: {
          from: 'communications',
          localField: '_id',
          foreignField: 'company',
          as: 'communications'
        }
      },
      {
        $addFields: {
          nextCommunication: {
            $filter: {
              input: '$communications',
              as: 'comm',
              cond: { 
                $and: [
                  { $eq: ['$$comm.status', 'pending'] },
                  { $gte: ['$$comm.scheduledDate', new Date()] }
                ]
              }
            }
          }
        }
      },
      {
        $project: {
          name: 1,
          emails: 1,
          phoneNumbers: 1,
          lastCommunication: 1,
          lastCommunicationType: 1,
          communications: {
            $map: {
              input: '$communications',
              as: 'comm',
              in: {
                _id: '$$comm._id',
                type: '$$comm.type',
                date: '$$comm.date',
                scheduledDate: '$$comm.scheduledDate',
                status: '$$comm.status',
                notes: '$$comm.notes'
              }
            }
          },
          nextCommunication: { $arrayElemAt: ['$nextCommunication', 0] },
          status: {
            $let: {
              vars: {
                nextComm: { $arrayElemAt: ['$nextCommunication', 0] }
              },
              in: {
                $switch: {
                  branches: [
                    {
                      case: { 
                        $and: [
                          { $ne: ['$$nextComm', null] },
                          { $lt: ['$$nextComm.scheduledDate', new Date()] }
                        ]
                      },
                      then: 'overdue'
                    },
                    {
                      case: {
                        $and: [
                          { $ne: ['$$nextComm', null] },
                          {
                            $eq: [
                              { $dateToString: { date: '$$nextComm.scheduledDate', format: '%Y-%m-%d' } },
                              { $dateToString: { date: new Date(), format: '%Y-%m-%d' } }
                            ]
                          }
                        ]
                      },
                      then: 'due'
                    }
                  ],
                  default: 'upcoming'
                }
              }
            }
          }
        }
      }
    ]);

    res.json({ companies, stats: calculateStats(companies) });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Helper function to calculate stats
const calculateStats = (companies) => {
  const stats = {
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  };

  companies.forEach(company => {
    const communications = company.communications || [];
    stats.total += communications.length;
    stats.completed += communications.filter(c => c.status === 'completed').length;
    stats.pending += communications.filter(c => 
      c.status === 'pending' && new Date(c.scheduledDate) >= new Date()
    ).length;
    stats.overdue += communications.filter(c => 
      c.status === 'pending' && new Date(c.scheduledDate) < new Date()
    ).length;
  });

  return stats;
};

// Log new communication
router.post('/communications', auth, async (req, res) => {
  try {
    const { companyIds, type, notes, date, status } = req.body;

    if (!companyIds || !Array.isArray(companyIds)) {
      return res.status(400).json({ 
        success: false,
        message: 'Company IDs must be provided as an array' 
      });
    }

    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Communication type is required'
      });
    }

    const communications = await Promise.all(
      companyIds.map(async (companyId) => {
        // First verify the company exists
        const company = await Company.findById(companyId);
        if (!company) {
          throw new Error(`Company with ID ${companyId} not found`);
        }

        const communication = new Communication({
          company: companyId,
          type,
          date: date || new Date(),
          notes,
          status: status || 'completed',
          createdBy: req.user._id
        });

        await communication.save();
        
        // Update company's last communication
        await Company.findByIdAndUpdate(companyId, {
          lastCommunicationType: type,
          $push: { communications: communication._id }
        });

        return communication;
      })
    );

    res.status(201).json({
      success: true,
      message: 'Communications logged successfully',
      communications
    });
  } catch (error) {
    console.error('Error creating communications:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging communication',
      error: error.message
    });
  }
});

// Helper function to calculate next communication date
const calculateNextCommunication = (date, type) => {
  const nextDate = new Date(date);
  // Add default 30 days
  nextDate.setDate(nextDate.getDate() + 30);
  return nextDate;
};

// Update communication status
router.put('/communications/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const communication = await Communication.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(status === 'completed' ? { date: new Date() } : {})
      },
      { new: true }
    ).populate('company', 'name');

    if (!communication) {
      return res.status(404).json({ message: 'Communication not found' });
    }

    res.json(communication);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error updating communication' });
  }
});

// Get calendar view
router.get('/calendar', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const communications = await Communication.find({
      $or: [
        { date: { $gte: startDate, $lte: endDate } },
        { scheduledDate: { $gte: startDate, $lte: endDate } }
      ]
    })
    .populate('company', 'name')
    .populate('createdBy', 'name')
    .sort('date');

    res.json(communications);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error fetching calendar data' });
  }
});

// Get user companies with highlight status
router.get('/companies', auth, async (req, res) => {
  try {
    const companies = await Company.find()
      .select('name emails phoneNumbers lastCommunication lastCommunicationType highlightStatus location')
      .sort('name');
    res.json(companies);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error fetching companies' });
  }
});

// Get notifications
router.get('/notifications', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all pending communications
    const communications = await Communication.find({
      createdBy: req.user._id,
      status: 'pending'
    })
    .populate('company', 'name')
    .sort('scheduledDate')
    .lean();

    console.log('Found communications:', communications);

    // Process the communications
    const result = {
      overdue: [],
      dueToday: []
    };

    // Safely process each communication
    communications.forEach(comm => {
      if (comm.scheduledDate) {
        const scheduledDate = new Date(comm.scheduledDate);
        scheduledDate.setHours(0, 0, 0, 0);
        
        if (scheduledDate < today) {
          result.overdue.push(comm);
        } else if (scheduledDate.getTime() === today.getTime()) {
          result.dueToday.push(comm);
        }
      }
    });

    console.log('Sending notifications:', result);
    res.json(result);

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      overdue: [],
      dueToday: [],
      error: 'Failed to fetch notifications'
    });
  }
});

// Get company communications
router.get('/companies/:id/communications', auth, async (req, res) => {
  try {
    const communications = await Communication.find({
      company: req.params.id
    })
    .sort('-date')
    .populate('createdBy', 'name');

    res.json(communications);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error fetching communications' });
  }
});

// Schedule new communication
router.post('/communications/schedule', auth, async (req, res) => {
  try {
    const { companyId, type, scheduledDate, notes } = req.body;

    const communication = await Communication.create({
      company: companyId,
      type,
      scheduledDate: new Date(scheduledDate),
      notes,
      status: 'pending',
      createdBy: req.user._id
    });

    await Company.findByIdAndUpdate(companyId, {
      $push: { communications: communication._id }
    });

    res.status(201).json(communication);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error scheduling communication' });
  }
});

// Add this route to handle quick notifications
router.post('/communications/quick-test', auth, async (req, res) => {
  try {
    const { companyId } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const [overdueNotification, todayNotification] = await Promise.all([
      Communication.create({
        company: companyId,
        type: 'phone',
        scheduledDate: yesterday.toISOString(),
        date: yesterday.toISOString(),
        notes: 'Overdue test notification',
        status: 'pending',
        createdBy: req.user._id
      }),
      Communication.create({
        company: companyId,
        type: 'email',
        scheduledDate: today.toISOString(),
        date: today.toISOString(),
        notes: 'Today test notification',
        status: 'pending',
        createdBy: req.user._id
      })
    ]);

    // Update company in one operation
    await Company.findByIdAndUpdate(companyId, {
      $push: { 
        communications: { 
          $each: [overdueNotification._id, todayNotification._id] 
        } 
      }
    });

    res.status(201).json({
      success: true,
      message: 'Test notifications created',
      notifications: [overdueNotification, todayNotification]
    });
  } catch (error) {
    console.error('Error creating test notifications:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating test notifications' 
    });
  }
});

// Add company route
router.post('/companies', auth, async (req, res) => {
  try {
    const companyData = {
      ...req.body,
      createdBy: req.user._id,
      status: 'active',
      highlightStatus: 'none'
    };

    // Validate required fields
    if (!companyData.name || !companyData.location) {
      return res.status(400).json({ 
        message: 'Company name and location are required' 
      });
    }

    // Ensure arrays are properly formatted
    if (!Array.isArray(companyData.emails) || !Array.isArray(companyData.phoneNumbers)) {
      return res.status(400).json({ 
        message: 'Emails and phone numbers must be arrays' 
      });
    }

    const company = await Company.create(companyData);
    
    // Return the created company
    const populatedCompany = await Company.findById(company._id)
      .populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      company: populatedCompany
    });
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating company',
      error: error.message 
    });
  }
});

module.exports = router; 