import React, { createContext, useContext, useState, useEffect } from 'react';
import { communicationMethodService } from '../services/communicationMethodService';
import { useAuth } from './AuthContext';

const CommunicationMethodContext = createContext(null);

export const CommunicationMethodProvider = ({ children }) => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchMethods = async () => {
    try {
      if (user) {
        const data = await communicationMethodService.getMethods();
        setMethods(data);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching methods:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMethods();
    }
  }, [user]);

  const createMethod = async (methodData) => {
    try {
      const newMethod = await communicationMethodService.createMethod(methodData);
      setMethods([...methods, newMethod]);
      return newMethod;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateMethod = async (id, methodData) => {
    try {
      const updated = await communicationMethodService.updateMethod(id, methodData);
      setMethods(methods.map(m => m._id === id ? updated : m));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteMethod = async (id) => {
    try {
      await communicationMethodService.deleteMethod(id);
      setMethods(methods.filter(m => m._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const reorderMethods = async (reorderedMethods) => {
    try {
      const updated = await communicationMethodService.reorderMethods(reorderedMethods);
      setMethods(updated);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    methods,
    loading,
    error,
    fetchMethods,
    createMethod,
    updateMethod,
    deleteMethod,
    reorderMethods
  };

  return (
    <CommunicationMethodContext.Provider value={value}>
      {children}
    </CommunicationMethodContext.Provider>
  );
};

export const useCommunicationMethod = () => {
  const context = useContext(CommunicationMethodContext);
  if (!context) {
    throw new Error('useCommunicationMethod must be used within a CommunicationMethodProvider');
  }
  return context;
}; 