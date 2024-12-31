import api from './api';

export const communicationMethodService = {
  getMethods: async () => {
    try {
      const response = await api.get('/communication-methods');
      return response.data;
    } catch (error) {
      console.error('Error fetching methods:', error);
      throw error.response?.data || { message: 'Failed to fetch communication methods' };
    }
  },

  createMethod: async (methodData) => {
    try {
      const response = await api.post('/communication-methods', methodData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create communication method' };
    }
  },

  updateMethod: async (id, methodData) => {
    try {
      const response = await api.put(`/communication-methods/${id}`, methodData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update communication method' };
    }
  },

  deleteMethod: async (id) => {
    try {
      const response = await api.delete(`/communication-methods/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting method:', error);
      throw error.response?.data || { message: 'Error deleting communication method' };
    }
  },

  reorderMethods: async (methods) => {
    try {
      const response = await api.post('/communication-methods/reorder', { methods });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reorder methods' };
    }
  }
}; 