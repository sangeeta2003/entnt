// import api from './api';

// export const userDashboardService = {
//   getDashboardData: async () => {
//     try {
//       const response = await api.get('/user/dashboard');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       throw error.response?.data || { message: 'Failed to fetch dashboard data' };
//     }
//   },

//   getCompanies: async () => {
//     try {
//       const response = await api.get('/user/companies');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching companies:', error);
//       throw error.response?.data || { message: 'Failed to fetch companies' };
//     }
//   },

//   logCommunication: async (data) => {
//     try {
//       if (!data.type) {
//         throw new Error('Communication type is required');
//       }

//       if (!data.companyIds || data.companyIds.length === 0) {
//         throw new Error('At least one company must be selected');
//       }

//       const companyIds = Array.isArray(data.companyIds) ? data.companyIds : [data.companyIds];

//       const response = await api.post('/user/communications', {
//         ...data,
//         companyIds,
//         date: data.date || new Date().toISOString(),
//         status: data.status || 'completed'
//       });

//       return response.data;
//     } catch (error) {
//       console.error('Error logging communication:', error);
//       throw error.response?.data || { message: error.message || 'Failed to log communication' };
//     }
//   },

//   updateCommunication: async (id, data) => {
//     try {
//       const response = await api.put(`/user/communications/${id}`, data);
//       return response.data;
//     } catch (error) {
//       console.error('Error updating communication:', error);
//       throw error.response?.data || { message: 'Failed to update communication' };
//     }
//   },

//   getCalendarView: async (month, year) => {
//     try {
//       const response = await api.get(`/user/calendar?month=${month}&year=${year}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching calendar data:', error);
//       throw error.response?.data || { message: 'Failed to fetch calendar data' };
//     }
//   },

//   getCompanyCommunications: async (companyId) => {
//     try {
//       const response = await api.get(`/user/companies/${companyId}/communications`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching company communications:', error);
//       throw error.response?.data || { message: 'Failed to fetch communications' };
//     }
//   },

//   getNotifications: async () => {
//     try {
//       console.log('Fetching notifications...');
//       const response = await api.get('/user/notifications');
//       console.log('Raw response:', response);
      
//       // Ensure we have valid data
//       if (!response.data) {
//         console.warn('No data received from server');
//         return { overdue: [], dueToday: [] };
//       }

//       // Extract the data we need
//       const { overdue = [], dueToday = [] } = response.data;
      
//       console.log('Processed notifications:', { overdue, dueToday });
      
//       return {
//         overdue: overdue,
//         dueToday: dueToday
//       };
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//       throw new Error('Failed to fetch notifications');
//     }
//   },

//   scheduleCommunication: async (data) => {
//     try {
//       const response = await api.post('/user/communications/schedule', data);
//       return response.data;
//     } catch (error) {
//       console.error('Error scheduling communication:', error);
//       throw error.response?.data || { message: 'Failed to schedule communication' };
//     }
//   },

//   updateCommunicationStatus: async (id, status) => {
//     try {
//       const response = await api.put(`/user/communications/${id}`, { status });
//       return response.data;
//     } catch (error) {
//       console.error('Error updating communication status:', error);
//       throw error.response?.data || { message: 'Failed to update status' };
//     }
//   },

//   createQuickNotifications: async (companyId) => {
//     try {
//       const response = await api.post('/user/communications/quick-test', { companyId });
//       return response.data;
//     } catch (error) {
//       console.error('Error creating quick notifications:', error);
//       throw error.response?.data || { message: 'Failed to create quick notifications' };
//     }
//   },

//   addCompany: async (companyData) => {
//     try {
//       const response = await api.post('/user/companies', companyData);
//       return response.data;
//     } catch (error) {
//       console.error('Error adding company:', error);
//       throw error.response?.data || { message: 'Failed to add company' };
//     }
//   }
// }; 


// import api from './api';

// export const userDashboardService = {
//   getDashboardData: async () => {
//     try {
//       const response = await api.get('/user/dashboard');
//       console.log('Raw dashboard data:', response.data); // Debug log
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       throw error.response?.data || { message: 'Failed to fetch dashboard data' };
//     }
//   },

//   getCompanies: async () => {
//     try {
//       const response = await api.get('/user/companies');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching companies:', error);
//       throw error.response?.data || { message: 'Failed to fetch companies' };
//     }
//   },

//   logCommunication: async (data) => {
//     try {
//       if (!data.type) {
//         throw new Error('Communication type is required');
//       }

//       if (!data.companyIds || data.companyIds.length === 0) {
//         throw new Error('At least one company must be selected');
//       }

//       const companyIds = Array.isArray(data.companyIds) ? data.companyIds : [data.companyIds];

//       const response = await api.post('/user/communications', {
//         ...data,
//         companyIds,
//         date: data.date || new Date().toISOString(),
//         status: data.status || 'completed'
//       });

//       return response.data;
//     } catch (error) {
//       console.error('Error logging communication:', error);
//       throw error.response?.data || { message: error.message || 'Failed to log communication' };
//     }
//   },

//   updateCommunication: async (id, data) => {
//     try {
//       const response = await api.put(`/user/communications/${id}`, data);
//       return response.data;
//     } catch (error) {
//       console.error('Error updating communication:', error);
//       throw error.response?.data || { message: 'Failed to update communication' };
//     }
//   },

//   getCalendarView: async (month, year) => {
//     try {
//       const response = await api.get(`/user/calendar?month=${month}&year=${year}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching calendar data:', error);
//       throw error.response?.data || { message: 'Failed to fetch calendar data' };
//     }
//   },

//   getCompanyCommunications: async (companyId) => {
//     try {
//       const response = await api.get(`/user/companies/${companyId}/communications`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching company communications:', error);
//       throw error.response?.data || { message: 'Failed to fetch communications' };
//     }
//   },

//   getNotifications: async () => {
//     try {
//       console.log('Fetching notifications...');
//       const response = await api.get('/user/notifications');
//       console.log('Raw response:', response);
      
//       // Ensure we have valid data
//       if (!response.data) {
//         console.warn('No data received from server');
//         return { overdue: [], dueToday: [] };
//       }

//       // Extract the data we need
//       const { overdue = [], dueToday = [] } = response.data;
      
//       console.log('Processed notifications:', { overdue, dueToday });
      
//       return {
//         overdue: overdue,
//         dueToday: dueToday
//       };
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//       throw new Error('Failed to fetch notifications');
//     }
//   },

//   scheduleCommunication: async (data) => {
//     try {
//       const response = await api.post('/user/communications/schedule', data);
//       return response.data;
//     } catch (error) {
//       console.error('Error scheduling communication:', error);
//       throw error.response?.data || { message: 'Failed to schedule communication' };
//     }
//   },

//   updateCommunicationStatus: async (id, status) => {
//     try {
//       const response = await api.put(`/user/communications/${id}`, { status });
//       return response.data;
//     } catch (error) {
//       console.error('Error updating communication status:', error);
//       throw error.response?.data || { message: 'Failed to update status' };
//     }
//   },

//   createQuickNotifications: async (companyId) => {
//     try {
//       const response = await api.post('/user/communications/quick-test', { companyId });
//       return response.data;
//     } catch (error) {
//       console.error('Error creating quick notifications:', error);
//       throw error.response?.data || { message: 'Failed to create quick notifications' };
//     }
//   },

//   addCompany: async (companyData) => {
//     try {
//       const response = await api.post('/user/companies', companyData);
//       return response.data;
//     } catch (error) {
//       console.error('Error adding company:', error);
//       throw error.response?.data || { message: 'Failed to add company' };
//     }
//   }
// }; 



// import api from './api';

// export const userDashboardService = {
//   getDashboardData: async () => {
//     try {
//       const response = await api.get('/user/dashboard');
//       console.log('Raw dashboard data:', response.data); // Debug log
      
//       // Ensure dates are in the correct format
//       const processedData = {
//         ...response.data,
//         companies: response.data.companies?.map(company => ({
//           ...company,
//           communications: company.communications?.map(comm => ({
//             ...comm,
//             date: comm.date // Ensure this is in ISO format from backend
//           })),
//           nextCommunication: company.nextCommunication ? {
//             ...company.nextCommunication,
//             scheduledDate: company.nextCommunication.scheduledDate // Ensure this is in ISO format
//           } : null
//         }))
//       };

//       console.log('Processed dashboard data:', processedData); // Debug log
//       return processedData;
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       throw error.response?.data || { message: 'Failed to fetch dashboard data' };
//     }
//   },

//   getCompanies: async () => {
//     try {
//       const response = await api.get('/user/companies');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching companies:', error);
//       throw error.response?.data || { message: 'Failed to fetch companies' };
//     }
//   },

//   logCommunication: async (data) => {
//     try {
//       if (!data.type) {
//         throw new Error('Communication type is required');
//       }

//       if (!data.companyIds || data.companyIds.length === 0) {
//         throw new Error('At least one company must be selected');
//       }

//       const companyIds = Array.isArray(data.companyIds) ? data.companyIds : [data.companyIds];

//       const response = await api.post('/user/communications', {
//         ...data,
//         companyIds,
//         date: data.date || new Date().toISOString(),
//         status: data.status || 'completed'
//       });

//       return response.data;
//     } catch (error) {
//       console.error('Error logging communication:', error);
//       throw error.response?.data || { message: error.message || 'Failed to log communication' };
//     }
//   },

//   updateCommunication: async (id, data) => {
//     try {
//       const response = await api.put(`/user/communications/${id}`, data);
//       return response.data;
//     } catch (error) {
//       console.error('Error updating communication:', error);
//       throw error.response?.data || { message: 'Failed to update communication' };
//     }
//   },

//   getCalendarView: async (month, year) => {
//     try {
//       const response = await api.get(`/user/calendar?month=${month}&year=${year}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching calendar data:', error);
//       throw error.response?.data || { message: 'Failed to fetch calendar data' };
//     }
//   },

//   getCompanyCommunications: async (companyId) => {
//     try {
//       const response = await api.get(`/user/companies/${companyId}/communications`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching company communications:', error);
//       throw error.response?.data || { message: 'Failed to fetch communications' };
//     }
//   },

//   getNotifications: async () => {
//     try {
//       console.log('Fetching notifications...');
//       const response = await api.get('/user/notifications');
//       console.log('Raw response:', response);
      
//       // Ensure we have valid data
//       if (!response.data) {
//         console.warn('No data received from server');
//         return { overdue: [], dueToday: [] };
//       }

//       // Extract the data we need
//       const { overdue = [], dueToday = [] } = response.data;
      
//       console.log('Processed notifications:', { overdue, dueToday });
      
//       return {
//         overdue: overdue,
//         dueToday: dueToday
//       };
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//       throw new Error('Failed to fetch notifications');
//     }
//   },

//   scheduleCommunication: async (data) => {
//     try {
//       const response = await api.post('/user/communications/schedule', data);
//       return response.data;
//     } catch (error) {
//       console.error('Error scheduling communication:', error);
//       throw error.response?.data || { message: 'Failed to schedule communication' };
//     }
//   },

//   updateCommunicationStatus: async (id, status) => {
//     try {
//       const response = await api.put(`/user/communications/${id}`, { status });
//       return response.data;
//     } catch (error) {
//       console.error('Error updating communication status:', error);
//       throw error.response?.data || { message: 'Failed to update status' };
//     }
//   },

//   createQuickNotifications: async (companyId) => {
//     try {
//       const response = await api.post('/user/communications/quick-test', { companyId });
//       return response.data;
//     } catch (error) {
//       console.error('Error creating quick notifications:', error);
//       throw error.response?.data || { message: 'Failed to create quick notifications' };
//     }
//   },

//   addCompany: async (companyData) => {
//     try {
//       const response = await api.post('/user/companies', companyData);
//       return response.data;
//     } catch (error) {
//       console.error('Error adding company:', error);
//       throw error.response?.data || { message: 'Failed to add company' };
//     }
//   }
// }; 




import api from './api';

export const userDashboardService = {
  getDashboardData: async () => {
    try {
      const response = await api.get('/user/dashboard');
      console.log('Raw dashboard data:', response.data); // Debug log
      
      // Ensure dates are in the correct format
      const processedData = {
        ...response.data,
        companies: response.data.companies?.map(company => ({
          ...company,
          communications: company.communications?.map(comm => ({
            ...comm,
            // Try to get a valid date from multiple possible fields
            date: comm.date || comm.scheduledDate || comm.createdAt
          })),
          nextCommunication: company.nextCommunication ? {
            ...company.nextCommunication,
            // Try to get a valid date from multiple possible fields
            scheduledDate: company.nextCommunication.scheduledDate || 
                          company.nextCommunication.date || 
                          company.nextCommunication.createdAt
          } : null
        }))
      };

      console.log('Processed dashboard data:', processedData); // Debug log
      return processedData;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error.response?.data || { message: 'Failed to fetch dashboard data' };
    }
  },

  getCompanies: async () => {
    try {
      const response = await api.get('/user/companies');
      return response.data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error.response?.data || { message: 'Failed to fetch companies' };
    }
  },

  logCommunication: async (data) => {
    try {
      if (!data.type) {
        throw new Error('Communication type is required');
      }

      if (!data.companyIds || data.companyIds.length === 0) {
        throw new Error('At least one company must be selected');
      }

      const companyIds = Array.isArray(data.companyIds) ? data.companyIds : [data.companyIds];

      const response = await api.post('/user/communications', {
        ...data,
        companyIds,
        date: data.date || new Date().toISOString(),
        status: data.status || 'completed'
      });

      return response.data;
    } catch (error) {
      console.error('Error logging communication:', error);
      throw error.response?.data || { message: error.message || 'Failed to log communication' };
    }
  },

  updateCommunication: async (id, data) => {
    try {
      const response = await api.put(`/user/communications/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating communication:', error);
      throw error.response?.data || { message: 'Failed to update communication' };
    }
  },

  getCalendarView: async (month, year) => {
    try {
      const response = await api.get(`/user/calendar?month=${month}&year=${year}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      throw error.response?.data || { message: 'Failed to fetch calendar data' };
    }
  },

  getCompanyCommunications: async (companyId) => {
    try {
      const response = await api.get(`/user/companies/${companyId}/communications`);
      return response.data;
    } catch (error) {
      console.error('Error fetching company communications:', error);
      throw error.response?.data || { message: 'Failed to fetch communications' };
    }
  },

  getNotifications: async () => {
    try {
      console.log('Fetching notifications...');
      const response = await api.get('/user/notifications');
      console.log('Raw response:', response);
      
      // Ensure we have valid data
      if (!response.data) {
        console.warn('No data received from server');
        return { overdue: [], dueToday: [] };
      }

      // Extract the data we need
      const { overdue = [], dueToday = [] } = response.data;
      
      console.log('Processed notifications:', { overdue, dueToday });
      
      return {
        overdue: overdue,
        dueToday: dueToday
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new Error('Failed to fetch notifications');
    }
  },

  scheduleCommunication: async (data) => {
    try {
      const response = await api.post('/user/communications/schedule', data);
      return response.data;
    } catch (error) {
      console.error('Error scheduling communication:', error);
      throw error.response?.data || { message: 'Failed to schedule communication' };
    }
  },

  updateCommunicationStatus: async (id, status) => {
    try {
      const response = await api.put(`/user/communications/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating communication status:', error);
      throw error.response?.data || { message: 'Failed to update status' };
    }
  },

  createQuickNotifications: async (companyId) => {
    try {
      const response = await api.post('/user/communications/quick-test', { companyId });
      return response.data;
    } catch (error) {
      console.error('Error creating quick notifications:', error);
      throw error.response?.data || { message: 'Failed to create quick notifications' };
    }
  },

  addCompany: async (companyData) => {
    try {
      const response = await api.post('/user/companies', companyData);
      return response.data;
    } catch (error) {
      console.error('Error adding company:', error);
      throw error.response?.data || { message: 'Failed to add company' };
    }
  }
}; 



// import api from './api';

// export const userDashboardService = {
//   getDashboardData: async () => {
//     try {
//       const response = await api.get('/user/dashboard');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       throw error.response?.data || { message: 'Failed to fetch dashboard data' };
//     }
//   },

//   getCompanies: async () => {
//     try {
//       const response = await api.get('/user/companies');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching companies:', error);
//       throw error.response?.data || { message: 'Failed to fetch companies' };
//     }
//   },

//   logCommunication: async (data) => {
//     try {
//       if (!data.type) {
//         throw new Error('Communication type is required');
//       }

//       if (!data.companyIds || data.companyIds.length === 0) {
//         throw new Error('At least one company must be selected');
//       }

//       const companyIds = Array.isArray(data.companyIds) ? data.companyIds : [data.companyIds];

//       const response = await api.post('/user/communications', {
//         ...data,
//         companyIds,
//         date: data.date || new Date().toISOString(),
//         status: data.status || 'completed'
//       });

//       return response.data;
//     } catch (error) {
//       console.error('Error logging communication:', error);
//       throw error.response?.data || { message: error.message || 'Failed to log communication' };
//     }
//   },

//   updateCommunication: async (id, data) => {
//     try {
//       const response = await api.put(`/user/communications/${id}`, data);
//       return response.data;
//     } catch (error) {
//       console.error('Error updating communication:', error);
//       throw error.response?.data || { message: 'Failed to update communication' };
//     }
//   },

//   getCalendarView: async (month, year) => {
//     try {
//       const response = await api.get(`/user/calendar?month=${month}&year=${year}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching calendar data:', error);
//       throw error.response?.data || { message: 'Failed to fetch calendar data' };
//     }
//   },

//   getCompanyCommunications: async (companyId) => {
//     try {
//       const response = await api.get(`/user/companies/${companyId}/communications`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching company communications:', error);
//       throw error.response?.data || { message: 'Failed to fetch communications' };
//     }
//   },

//   getNotifications: async () => {
//     try {
//       const response = await api.get('/api/communications/notifications');
//       console.log('Raw response:', response);
//       return {
//         overdue: response.data.overdue || [],
//         dueToday: response.data.dueToday || []
//       };
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//       throw error.response?.data || { message: 'Failed to fetch notifications' };
//     }
//   },

//   scheduleCommunication: async (data) => {
//     try {
//       // Validate required fields
//       if (!data.companyId || !data.type || !data.scheduledDate) {
//         throw new Error('Company, type, and scheduled date are required');
//       }

//       const response = await api.post('/api/communications/schedule', {
//         companyId: data.companyId,
//         type: data.type,
//         scheduledDate: data.scheduledDate,
//         description: data.description || '',
//         status: data.status || 'pending'
//       });

//       return response.data;
//     } catch (error) {
//       console.error('Error scheduling communication:', error);
//       throw error.response?.data || { 
//         message: error.message || 'Failed to schedule communication' 
//       };
//     }
//   },

//   updateCommunicationStatus: async (id, status) => {
//     try {
//       const response = await api.patch(`/api/communications/${id}/status`, { status });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: 'Failed to update status' };
//     }
//   },

//   createQuickNotifications: async (companyId) => {
//     try {
//       const response = await api.post('/user/communications/quick-test', { companyId });
//       return response.data;
//     } catch (error) {
//       console.error('Error creating quick notifications:', error);
//       throw error.response?.data || { message: 'Failed to create quick notifications' };
//     }
//   },

//   addCompany: async (companyData) => {
//     try {
//       const response = await api.post('/user/companies', companyData);
//       return response.data;
//     } catch (error) {
//       console.error('Error adding company:', error);
//       throw error.response?.data || { message: 'Failed to add company' };
//     }
//   }
// }; 


// import api from './api';

// export const userDashboardService = {
//   getDashboardData: async () => {
//     try {
//       const response = await api.get('/user/dashboard');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       throw error.response?.data || { message: 'Failed to fetch dashboard data' };
//     }
//   },

//   getCompanies: async () => {
//     try {
//       const response = await api.get('/user/companies');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching companies:', error);
//       throw error.response?.data || { message: 'Failed to fetch companies' };
//     }
//   },

//   logCommunication: async (data) => {
//     try {
//       if (!data.type) {
//         throw new Error('Communication type is required');
//       }

//       if (!data.companyIds || data.companyIds.length === 0) {
//         throw new Error('At least one company must be selected');
//       }

//       const companyIds = Array.isArray(data.companyIds) ? data.companyIds : [data.companyIds];

//       const response = await api.post('/user/communications', {
//         ...data,
//         companyIds,
//         date: data.date || new Date().toISOString(),
//         status: data.status || 'completed'
//       });

//       return response.data;
//     } catch (error) {
//       console.error('Error logging communication:', error);
//       throw error.response?.data || { message: error.message || 'Failed to log communication' };
//     }
//   },

//   updateCommunication: async (id, data) => {
//     try {
//       const response = await api.put(`/user/communications/${id}`, data);
//       return response.data;
//     } catch (error) {
//       console.error('Error updating communication:', error);
//       throw error.response?.data || { message: 'Failed to update communication' };
//     }
//   },

//   getCalendarView: async (month, year) => {
//     try {
//       const response = await api.get(`/user/calendar?month=${month}&year=${year}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching calendar data:', error);
//       throw error.response?.data || { message: 'Failed to fetch calendar data' };
//     }
//   },

//   getCompanyCommunications: async (companyId) => {
//     try {
//       const response = await api.get(`/user/companies/${companyId}/communications`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching company communications:', error);
//       throw error.response?.data || { message: 'Failed to fetch communications' };
//     }
//   },

//   getNotifications: async () => {
//     try {
//       const response = await api.get('/communications/notifications');
//       console.log('Raw response:', response);
//       return {
//         overdue: response.data.overdue || [],
//         dueToday: response.data.dueToday || []
//       };
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//       throw error.response?.data || { message: 'Failed to fetch notifications' };
//     }
//   },

//   scheduleCommunication: async (data) => {
//     try {
//       // Validate required fields
//       if (!data.companyId || !data.type || !data.scheduledDate) {
//         throw new Error('Company, type, and scheduled date are required');
//       }

//       console.log('Sending communication data:', data); // Debug log

//       const response = await api.post('/api/communications/schedule', {
//         companyId: data.companyId,
//         type: data.type,
//         scheduledDate: data.scheduledDate,
//         description: data.description || '',
//         status: data.status || 'pending'
//       });

//       console.log('Server response:', response.data); // Debug log
//       return response.data;
//     } catch (error) {
//       console.error('Error scheduling communication:', error);
//       console.error('Error details:', error.response?.data); // Debug log
//       throw error.response?.data || { 
//         message: error.message || 'Failed to schedule communication' 
//       };
//     }
//   },

//   updateCommunicationStatus: async (id, status) => {
//     try {
//       const response = await api.patch(`/communications/${id}/status`, { status });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: 'Failed to update status' };
//     }
//   },

//   createQuickNotifications: async (companyId) => {
//     try {
//       const response = await api.post('/user/communications/quick-test', { companyId });
//       return response.data;
//     } catch (error) {
//       console.error('Error creating quick notifications:', error);
//       throw error.response?.data || { message: 'Failed to create quick notifications' };
//     }
//   },

//   addCompany: async (companyData) => {
//     try {
//       const response = await api.post('/user/companies', companyData);
//       return response.data;
//     } catch (error) {
//       console.error('Error adding company:', error);
//       throw error.response?.data || { message: 'Failed to add company' };
//     }
//   }
// }; 

// import api from './api';

// export const userDashboardService = {
//   getDashboardData: async () => {
//     try {
//       const response = await api.get('/user/dashboard');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       throw error.response?.data || { message: 'Failed to fetch dashboard data' };
//     }
//   },

//   getCompanies: async () => {
//     try {
//       const response = await api.get('/user/companies');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching companies:', error);
//       throw error.response?.data || { message: 'Failed to fetch companies' };
//     }
//   },

//   logCommunication: async (data) => {
//     try {
//       if (!data.type) {
//         throw new Error('Communication type is required');
//       }

//       if (!data.companyIds || data.companyIds.length === 0) {
//         throw new Error('At least one company must be selected');
//       }

//       const companyIds = Array.isArray(data.companyIds) ? data.companyIds : [data.companyIds];

//       const response = await api.post('/user/communications', {
//         ...data,
//         companyIds,
//         date: data.date || new Date().toISOString(),
//         status: data.status || 'completed'
//       });

//       return response.data;
//     } catch (error) {
//       console.error('Error logging communication:', error);
//       throw error.response?.data || { message: error.message || 'Failed to log communication' };
//     }
//   },

//   updateCommunication: async (id, data) => {
//     try {
//       const response = await api.put(`/user/communications/${id}`, data);
//       return response.data;
//     } catch (error) {
//       console.error('Error updating communication:', error);
//       throw error.response?.data || { message: 'Failed to update communication' };
//     }
//   },

//   getCalendarView: async (month, year) => {
//     try {
//       const response = await api.get(`/user/calendar?month=${month}&year=${year}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching calendar data:', error);
//       throw error.response?.data || { message: 'Failed to fetch calendar data' };
//     }
//   },

//   getCompanyCommunications: async (companyId) => {
//     try {
//       const response = await api.get(`/user/companies/${companyId}/communications`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching company communications:', error);
//       throw error.response?.data || { message: 'Failed to fetch communications' };
//     }
//   },

//   getNotifications: async () => {
//     try {
//       const response = await api.get('/communications/notifications');
//       console.log('Raw response:', response);
//       return {
//         overdue: response.data.overdue || [],
//         dueToday: response.data.dueToday || []
//       };
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//       throw error.response?.data || { message: 'Failed to fetch notifications' };
//     }
//   },

//   scheduleCommunication: async (communicationData) => {
//     try {
//       console.log('Sending communication data:', communicationData);
//       const response = await api.post('/communications/schedule', communicationData);
//       return response.data;
//     } catch (error) {
//       console.error('Error scheduling communication:', error);
//       console.error('Error details:', error.response?.data || error.message);
//       throw error;
//     }
//   },

//   updateCommunicationStatus: async (id, status) => {
//     try {
//       const response = await api.patch(`/communications/${id}/status`, { status });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: 'Failed to update status' };
//     }
//   },

//   createQuickNotifications: async (companyId) => {
//     try {
//       const response = await api.post('/user/communications/quick-test', { companyId });
//       return response.data;
//     } catch (error) {
//       console.error('Error creating quick notifications:', error);
//       throw error.response?.data || { message: 'Failed to create quick notifications' };
//     }
//   },

//   addCompany: async (companyData) => {
//     try {
//       const response = await api.post('/user/companies', companyData);
//       return response.data;
//     } catch (error) {
//       console.error('Error adding company:', error);
//       throw error.response?.data || { message: 'Failed to add company' };
//     }
//   }
// }; 

// import api from './api';

// export const userDashboardService = {
//   getDashboardData: async () => {
//     try {
//       const response = await api.get('/user/dashboard');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       throw error.response?.data || { message: 'Failed to fetch dashboard data' };
//     }
//   },

//   getCompanies: async () => {
//     try {
//       const response = await api.get('/user/companies');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching companies:', error);
//       throw error.response?.data || { message: 'Failed to fetch companies' };
//     }
//   },

//   logCommunication: async (data) => {
//     try {
//       if (!data.type) {
//         throw new Error('Communication type is required');
//       }

//       if (!data.companyIds || data.companyIds.length === 0) {
//         throw new Error('At least one company must be selected');
//       }

//       const companyIds = Array.isArray(data.companyIds) ? data.companyIds : [data.companyIds];

//       const response = await api.post('/user/communications', {
//         ...data,
//         companyIds,
//         date: data.date || new Date().toISOString(),
//         status: data.status || 'completed'
//       });

//       return response.data;
//     } catch (error) {
//       console.error('Error logging communication:', error);
//       throw error.response?.data || { message: error.message || 'Failed to log communication' };
//     }
//   },

//   updateCommunication: async (id, data) => {
//     try {
//       const response = await api.put(`/user/communications/${id}`, data);
//       return response.data;
//     } catch (error) {
//       console.error('Error updating communication:', error);
//       throw error.response?.data || { message: 'Failed to update communication' };
//     }
//   },

//   getCalendarView: async (month, year) => {
//     try {
//       const response = await api.get(`/user/calendar`, {
//         params: { month, year }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching calendar data:', error);
//       throw error.response?.data || { message: 'Failed to fetch calendar data' };
//     }
//   },

//   getCompanyCommunications: async (companyId) => {
//     try {
//       const response = await api.get(`/user/companies/${companyId}/communications`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching company communications:', error);
//       throw error.response?.data || { message: 'Failed to fetch communications' };
//     }
//   },

//   getNotifications: async () => {
//     try {
//       const response = await api.get('/communications/notifications');
//       console.log('Raw response:', response);
//       return {
//         overdue: response.data.overdue || [],
//         dueToday: response.data.dueToday || []
//       };
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//       throw error.response?.data || { message: 'Failed to fetch notifications' };
//     }
//   },

//   scheduleCommunication: async (communicationData) => {
//     try {
//       console.log('Sending communication data:', communicationData);
//       const response = await api.post('/communications/schedule', communicationData);
//       return response.data;
//     } catch (error) {
//       console.error('Error scheduling communication:', error);
//       console.error('Error details:', error.response?.data || error.message);
//       throw error;
//     }
//   },

//   updateCommunicationStatus: async (id, status) => {
//     try {
//       const response = await api.patch(`/communications/${id}/status`, { status });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: 'Failed to update status' };
//     }
//   },

//   createQuickNotifications: async (companyId) => {
//     try {
//       const response = await api.post('/user/communications/quick-test', { companyId });
//       return response.data;
//     } catch (error) {
//       console.error('Error creating quick notifications:', error);
//       throw error.response?.data || { message: 'Failed to create quick notifications' };
//     }
//   },

//   addCompany: async (companyData) => {
//     try {
//       const response = await api.post('/user/companies', companyData);
//       return response.data;
//     } catch (error) {
//       console.error('Error adding company:', error);
//       throw error.response?.data || { message: 'Failed to add company' };
//     }
//   }
// }; 


// import api from './api';

// export const userDashboardService = {
//   getDashboardData: async () => {
//     try {
//       const response = await api.get('/user/dashboard');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       throw error.response?.data || { message: 'Failed to fetch dashboard data' };
//     }
//   },

//   getCompanies: async () => {
//     try {
//       const response = await api.get('/user/companies');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching companies:', error);
//       throw error.response?.data || { message: 'Failed to fetch companies' };
//     }
//   },

//   logCommunication: async (data) => {
//     try {
//       if (!data.type) {
//         throw new Error('Communication type is required');
//       }

//       if (!data.companyIds || data.companyIds.length === 0) {
//         throw new Error('At least one company must be selected');
//       }

//       const companyIds = Array.isArray(data.companyIds) ? data.companyIds : [data.companyIds];

//       const response = await api.post('/user/communications', {
//         ...data,
//         companyIds,
//         date: data.date || new Date().toISOString(),
//         status: data.status || 'completed'
//       });

//       return response.data;
//     } catch (error) {
//       console.error('Error logging communication:', error);
//       throw error.response?.data || { message: error.message || 'Failed to log communication' };
//     }
//   },

//   updateCommunication: async (id, data) => {
//     try {
//       const response = await api.put(`/user/communications/${id}`, data);
//       return response.data;
//     } catch (error) {
//       console.error('Error updating communication:', error);
//       throw error.response?.data || { message: 'Failed to update communication' };
//     }
//   },

//   getCalendarView: async (month, year) => {
//     try {
//       // Get both scheduled communications and past communications
//       const [scheduledResponse, communicationsResponse] = await Promise.all([
//         api.get('/communications/schedule', { params: { month, year } }),
//         api.get('/communications', { params: { month, year } })
//       ]);

//       // Combine and format the data
//       const scheduledEvents = scheduledResponse.data.map(event => ({
//         ...event,
//         type: 'Scheduled: ' + event.type
//       }));

//       const pastEvents = communicationsResponse.data.map(event => ({
//         ...event,
//         type: event.type
//       }));

//       // Combine both types of events
//       const allEvents = [...scheduledEvents, ...pastEvents];

//       console.log('Calendar events:', allEvents); // Debug log
//       return allEvents;
//     } catch (error) {
//       console.error('Error fetching calendar data:', error);
//       throw error.response?.data || { message: 'Failed to fetch calendar data' };
//     }
//   },

//   getCompanyCommunications: async (companyId) => {
//     try {
//       const response = await api.get(`/user/companies/${companyId}/communications`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching company communications:', error);
//       throw error.response?.data || { message: 'Failed to fetch communications' };
//     }
//   },

//   getNotifications: async () => {
//     try {
//       const response = await api.get('/communications/notifications');
//       console.log('Raw response:', response);
//       return {
//         overdue: response.data.overdue || [],
//         dueToday: response.data.dueToday || []
//       };
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//       throw error.response?.data || { message: 'Failed to fetch notifications' };
//     }
//   },

//   scheduleCommunication: async (communicationData) => {
//     try {
//       console.log('Sending communication data:', communicationData);
//       const response = await api.post('/communications/schedule', communicationData);
//       return response.data;
//     } catch (error) {
//       console.error('Error scheduling communication:', error);
//       console.error('Error details:', error.response?.data || error.message);
//       throw error;
//     }
//   },

//   updateCommunicationStatus: async (id, status) => {
//     try {
//       const response = await api.patch(`/communications/${id}/status`, { status });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: 'Failed to update status' };
//     }
//   },

//   createQuickNotifications: async (companyId) => {
//     try {
//       const response = await api.post('/user/communications/quick-test', { companyId });
//       return response.data;
//     } catch (error) {
//       console.error('Error creating quick notifications:', error);
//       throw error.response?.data || { message: 'Failed to create quick notifications' };
//     }
//   },

//   addCompany: async (companyData) => {
//     try {
//       const response = await api.post('/user/companies', companyData);
//       return response.data;
//     } catch (error) {
//       console.error('Error adding company:', error);
//       throw error.response?.data || { message: 'Failed to add company' };
//     }
//   }
// }; 
