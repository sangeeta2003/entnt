const Company = require('../models/Company');
const Communication = require('../models/Communication');

class UserDashboardService {
  static async getDashboardStats(userId) {
    const stats = await Communication.aggregate([
      {
        $match: { createdBy: userId }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: ['$completed', 1, 0] }
          },
          pending: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$completed', false] },
                    { $gte: ['$scheduledDate', new Date()] }
                  ]
                },
                1,
                0
              ]
            }
          },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$completed', false] },
                    { $lt: ['$scheduledDate', new Date()] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    return stats[0] || { total: 0, completed: 0, pending: 0, overdue: 0 };
  }

  static async getCompanyDetails(companyId) {
    return Company.findById(companyId).populate({
      path: 'communications',
      options: { sort: { date: -1 }, limit: 5 }
    });
  }
}

module.exports = UserDashboardService; 