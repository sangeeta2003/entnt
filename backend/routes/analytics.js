const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Communication = require('../models/Communication');
const Company = require('../models/Company');
const User = require('../models/User');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');
const mongoose = require('mongoose');

// Get analytics dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const { startDate, endDate, companyId } = req.query;
    const isAdmin = req.user.role === 'admin';
    
    // Base query
    let query = {};
    
    // Date filters
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Role-based filters
    if (!isAdmin) {
      query.createdBy = req.user._id;
    }
    
    if (companyId && companyId !== 'all') {
      query.company = companyId;
    }

    // Fetch communications with correct population
    const communications = await Communication.find(query)
      .populate('company', 'name')
      .populate('createdBy', 'name')
      .sort('date');

    // Process communication frequency
    const communicationFrequency = communications.reduce((acc, comm) => {
      acc[comm.type] = (acc[comm.type] || 0) + 1;
      return acc;
    }, {});

    // Calculate engagement metrics by communication type
    const engagementMetrics = communications.reduce((acc, comm) => {
      if (!acc[comm.type]) {
        acc[comm.type] = {
          total: 0,
          completed: 0,
          pending: 0,
          overdue: 0
        };
      }
      
      acc[comm.type].total++;
      acc[comm.type][comm.status]++;
      
      return acc;
    }, {});

    // Calculate response rates
    const responseRates = Object.keys(engagementMetrics).map(type => ({
      method: type,
      responseRate: (engagementMetrics[type].completed / engagementMetrics[type].total) * 100,
      totalCount: engagementMetrics[type].total,
      completedCount: engagementMetrics[type].completed,
      pendingCount: engagementMetrics[type].pending,
      overdueCount: engagementMetrics[type].overdue
    }));

    // Get companies based on role
    const companies = isAdmin 
      ? await Company.find().select('name')
      : await Company.find({ _id: { $in: req.user.assignedCompanies } }).select('name');

    // Calculate overdue trends by company
    const overdueTrends = await Communication.aggregate([
      {
        $match: {
          status: 'overdue',
          ...(companyId && companyId !== 'all' ? { company: mongoose.Types.ObjectId(companyId) } : {})
        }
      },
      {
        $lookup: {
          from: 'companies',
          localField: 'company',
          foreignField: '_id',
          as: 'companyData'
        }
      },
      {
        $group: {
          _id: {
            company: '$companyData.name',
            month: { $month: '$date' },
            year: { $year: '$date' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);

    // Calculate effectiveness metrics
    const effectivenessMetrics = await Communication.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          },
          responseTime: {
            $avg: {
              $cond: [
                { $eq: ['$status', 'completed'] },
                { $subtract: ['$completedDate', '$date'] },
                null
              ]
            }
          }
        }
      }
    ]);

    // Format response
    res.json({
      communicationFrequency: {
        labels: Object.keys(communicationFrequency),
        datasets: [{
          label: 'Communication Methods',
          data: Object.values(communicationFrequency),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(249, 115, 22, 0.8)',
            'rgba(99, 102, 241, 0.8)',
            'rgba(156, 163, 175, 0.8)'
          ]
        }]
      },
      engagementEffectiveness: {
        labels: responseRates.map(rate => rate.method),
        datasets: [
          {
            label: 'Response Rate (%)',
            data: responseRates.map(rate => rate.responseRate.toFixed(1)),
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            borderColor: 'rgb(99, 102, 241)',
            borderWidth: 1
          }
        ]
      },
      detailedMetrics: responseRates,
      companies: companies,
      recentActivities: communications.map(comm => ({
        id: comm._id,
        type: comm.type,
        company: comm.company.name,
        action: `${comm.type} ${comm.status}`,
        time: comm.date,
        status: comm.status
      })).slice(0, 10),
      overdueTrends: {
        labels: overdueTrends.map(trend => 
          `${trend._id.company} - ${trend._id.month}/${trend._id.year}`
        ),
        datasets: [{
          label: 'Overdue Communications',
          data: overdueTrends.map(trend => trend.count),
          borderColor: 'rgb(239, 68, 68)',
          tension: 0.1
        }]
      },
      communicationEffectiveness: {
        labels: effectivenessMetrics.map(metric => metric._id),
        datasets: [
          {
            label: 'Response Rate (%)',
            data: effectivenessMetrics.map(metric => 
              ((metric.completed / metric.total) * 100).toFixed(1)
            ),
            backgroundColor: 'rgba(59, 130, 246, 0.5)'
          },
          {
            label: 'Avg Response Time (days)',
            data: effectivenessMetrics.map(metric => 
              metric.responseTime ? (metric.responseTime / (1000 * 60 * 60 * 24)).toFixed(1) : 0
            ),
            backgroundColor: 'rgba(16, 185, 129, 0.5)'
          }
        ]
      },
      activityLog: await getActivityLog(query, req.query.sortBy)
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
});

// Generate and download reports
router.get('/report', auth, async (req, res) => {
  try {
    const { format, startDate, endDate, companyId } = req.query;
    // Generate report logic here
    // Return PDF or CSV file
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error generating report' });
  }
});

router.get('/download', auth, async (req, res) => {
  try {
    const { format, startDate, endDate, companyId } = req.query;

    // Build query
    const query = {};
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (companyId && companyId !== 'all') {
      query.company = companyId;
    }

    // Add user filter if not admin
    if (req.user.role !== 'admin') {
      query.createdBy = req.user._id;
    }

    // Fetch data
    const communications = await Communication.find(query)
      .populate('company', 'name')
      .populate('createdBy', 'name')
      .sort('date');

    if (format === 'pdf') {
      // Create PDF
      const doc = new PDFDocument();
      
      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=analytics-report.pdf');
      
      // Pipe the PDF document to the response
      doc.pipe(res);
      
      // Add content to PDF
      doc.fontSize(25).text('Analytics Report', 100, 100);
      doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, 100, 130);
      
      // Add communication data
      doc.fontSize(14).text('Communications Summary', 100, 160);
      let yPosition = 190;
      
      communications.forEach(comm => {
        doc.fontSize(10).text(
          `${comm.company.name} - ${comm.type} - ${comm.status} - ${new Date(comm.date).toLocaleDateString()}`,
          120,
          yPosition
        );
        yPosition += 20;
      });
      
      // Finalize PDF
      doc.end();
    } else {
      // Create CSV
      const csvData = communications.map(comm => ({
        date: new Date(comm.date).toLocaleDateString(),
        company: comm.company.name,
        type: comm.type,
        status: comm.status,
        createdBy: comm.createdBy.name
      }));

      const fields = ['date', 'company', 'type', 'status', 'createdBy'];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(csvData);
      
      // Set response headers
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=analytics-report.csv');
      
      // Send CSV
      res.send(csv);
    }
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generating report' });
  }
});

const getActivityLog = async (query, sortBy = 'date') => {
  let activities = await Communication.find(query)
    .populate('company', 'name')
    .populate('createdBy', 'name')
    .sort(sortBy === 'date' ? '-date' : sortBy === 'company' ? 'company.name' : 'type')
    .limit(50);  // Limit to last 50 activities

  return activities.map(activity => ({
    id: activity._id,
    type: activity.type,
    company: activity.company.name,
    user: activity.createdBy.name,
    action: `${activity.type} ${activity.status}`,
    status: activity.status,
    date: activity.date,
    time: new Date(activity.date).toLocaleString(),
    description: activity.description
  }));
};

module.exports = router; 