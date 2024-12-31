import api from './api';

export const companyService = {
  getCompanies: async (page = 1, limit = 10, search = '', status = '', sortField = '', sortOrder = '') => {
    try {
      const response = await api.get('/companies', {
        params: { page, limit, search, status, sortField, sortOrder }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch companies' };
    }
  },

  getCompany: async (id) => {
    try {
      const response = await api.get(`/companies/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch company' };
    }
  },

  createCompany: async (companyData) => {
    try {
      const response = await api.post('/companies', companyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create company' };
    }
  },

  updateCompany: async (id, companyData) => {
    try {
      const response = await api.put(`/companies/${id}`, companyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update company' };
    }
  },

  deleteCompany: async (id) => {
    try {
      console.log('Deleting company with ID:', id);
      const response = await api.delete(`/companies/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete company error:', error);
      throw error.response?.data || { message: 'Failed to delete company' };
    }
  },

  getUpcomingCommunications: async () => {
    try {
      const response = await api.get('/companies/communications/upcoming');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch upcoming communications' };
    }
  }
}; 