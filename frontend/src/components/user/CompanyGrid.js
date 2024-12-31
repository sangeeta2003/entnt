import React from 'react';
import { motion } from 'framer-motion';
import CompanyCard from './CompanyCard';

const CompanyGrid = ({ companies = [], onCompanyClick, selectedCompanies = [] }) => {
  // Add error boundary
  if (!companies || !Array.isArray(companies)) {
    console.error('Companies prop is not an array:', companies);
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        No companies available
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        No companies found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {companies.map((company) => {
        if (!company || !company._id) {
          console.error('Invalid company object:', company);
          return null;
        }

        return (
          <motion.div
            key={company._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="h-full"
          >
            <CompanyCard
              company={company}
              onClick={() => onCompanyClick(company)}
              isSelected={selectedCompanies.some(
                (selectedCompany) => selectedCompany._id === company._id
              )}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default CompanyGrid; 