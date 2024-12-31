const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Company = require('../models/Company');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const roleGuard = require('../middleware/roleGuard');

// Protect all admin routes with authentication and admin check
router.use(auth, isAdmin);

// Protect admin routes
router.use(roleGuard(['admin']));

// Get dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const activeUsers = await User.countDocuments({ lastLoginAt: { $gt: new Date(Date.now() - 24*60*60*1000) }});

    // Get user growth data for the last 7 days
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 7 }
    ]);

    // Get recent activity
    const recentActivity = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt')
      .lean()
      .map(user => ({
        action: 'User Registered',
        user: user.name,
        timestamp: user.createdAt
      }));

    res.json({
      totalUsers,
      totalCompanies,
      activeUsers,
      userGrowth: userGrowth.map(item => ({
        date: item._id,
        count: item.count
      })),
      recentActivity
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
});

// Get users list with pagination
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .select('-password')
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router; 