import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { userDashboardService } from '../../services/userDashboardService';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const data = await userDashboardService.getCompanyCommunications();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Companies</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {companies.map((company) => (
            <li key={company._id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {company.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {company.recentCommunications?.length || 0} communications
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Next scheduled: {company.nextCommunication?.scheduledDate 
                      ? new Date(company.nextCommunication.scheduledDate).toLocaleDateString()
                      : 'None scheduled'}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default CompanyList; 