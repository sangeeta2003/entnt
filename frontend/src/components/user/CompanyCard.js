import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const CompanyCard = ({ company, onClick, isSelected }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'overdue':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'due':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <motion.div
      onClick={onClick}
      className={`relative p-6 rounded-lg border ${getStatusColor(company.status)} 
                  cursor-pointer hover:shadow-md transition-shadow`}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3">
          <CheckCircleIcon className="h-6 w-6 text-green-500" />
        </div>
      )}

      {/* Company name */}
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        {company.name}
      </h3>

      {/* Last communication */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Last Communication
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {company.lastCommunicationType ? (
            <>
              {company.lastCommunicationType} - {' '}
              {company.lastCommunication ? 
                format(new Date(company.lastCommunication), 'MMM d, yyyy') 
                : 'Date not available'
              }
            </>
          ) : (
            'No previous communications'
          )}
        </p>
      </div>

      {/* Next communication */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Next Communication
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {company.nextCommunication ? (
            <>
              {company.nextCommunication.type} - {' '}
              {format(new Date(company.nextCommunication.scheduledDate), 'MMM d, yyyy')}
            </>
          ) : (
            'No upcoming communications'
          )}
        </p>
      </div>

      {/* Contact info */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        {company.emails && company.emails[0] && (
          <p className="truncate">{company.emails[0]}</p>
        )}
        {company.phoneNumbers && company.phoneNumbers[0] && (
          <p>{company.phoneNumbers[0]}</p>
        )}
      </div>
    </motion.div>
  );
};

export default CompanyCard; 