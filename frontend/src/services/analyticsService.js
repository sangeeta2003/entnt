import api from './api';

export const analyticsService = {
  getAnalyticsData: async (params) => {
    try {
      const response = await api.get('/analytics/dashboard', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  },

  generateReport: async (params) => {
    try {
      const response = await api.get('/analytics/report', {
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
}; 