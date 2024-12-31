import api from './api';

export const dashboardService = {
  getDashboardData: async (params = {}) => {
    try {
      const response = await api.get('/analytics/dashboard', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard data' };
    }
  },

  updateCommunicationStatus: async (id, status) => {
    try {
      const response = await api.patch(`/communications/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update status' };
    }
  },

  toggleHighlight: async (id) => {
    try {
      const response = await api.patch(`/communications/${id}/highlight`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to toggle highlight' };
    }
  },

  downloadReport: async (params) => {
    try {
      const response = await api.get('/analytics/download', {
        params,
        responseType: 'blob'
      });

      const filename = `analytics-report.${params.format}`;
      
      const blob = new Blob([response.data], { 
        type: params.format === 'pdf' 
          ? 'application/pdf' 
          : 'text/csv; charset=utf-8'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Error downloading report:', error);
      throw new Error('Failed to download report');
    }
  }
}; 