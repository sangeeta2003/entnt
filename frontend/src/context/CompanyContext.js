import React, { createContext, useContext, useState } from 'react';
import { companyService } from '../services/companyService';

const CompanyContext = createContext(null);

export const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1
  });

  const fetchCompanies = async (page = 1, limit = 10, search = '', status = '', sortField = '', sortOrder = '') => {
    setLoading(true);
    try {
      const data = await companyService.getCompanies(page, limit, search, status, sortField, sortOrder);
      setCompanies(data.companies);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCompany = async (id) => {
    setLoading(true);
    try {
      const company = await companyService.getCompany(id);
      setError(null);
      return company;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async (companyData) => {
    setLoading(true);
    try {
      const company = await companyService.createCompany(companyData);
      setCompanies([company, ...companies]);
      setError(null);
      return company;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = async (id, companyData) => {
    setLoading(true);
    try {
      const updated = await companyService.updateCompany(id, companyData);
      setCompanies(companies.map(c => c._id === id ? updated : c));
      setError(null);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCompany = async (id) => {
    if (!id) {
      throw new Error('Company ID is required');
    }

    setLoading(true);
    try {
      await companyService.deleteCompany(id);
      setCompanies(companies.filter(c => c._id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingCommunications = async () => {
    setLoading(true);
    try {
      const data = await companyService.getUpcomingCommunications();
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const value = {
    companies,
    loading,
    error,
    pagination,
    fetchCompanies,
    getCompany,
    createCompany,
    updateCompany,
    deleteCompany,
    getUpcomingCommunications
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}; 