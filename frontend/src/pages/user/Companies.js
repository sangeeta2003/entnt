import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { userDashboardService } from '../../services/userDashboardService';
import { 
  BuildingOfficeIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ClockIcon,
  PlusIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import CommunicationActionModal from '../../components/user/CommunicationActionModal';
import ScheduleCommunicationModal from '../../components/user/ScheduleCommunicationModal';
import { useNavigate } from 'react-router-dom';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [error, setError] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedCompanyForSchedule, setSelectedCompanyForSchedule] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userDashboardService.getCompanies();
      if (!data || data.length === 0) {
        setError('No companies found. Please add some companies first.');
      }
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setError('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySelect = (company) => {
    console.log('Selecting company:', company); // Debug log
    setSelectedCompanies(prev => {
      if (prev.some(c => c._id === company._id)) {
        return prev.filter(c => c._id !== company._id);
      }
      return [...prev, company];
    });
  };

  const handleCommunicationClick = () => {
    console.log('Opening modal with selected companies:', selectedCompanies); // Debug log
    setShowCommunicationModal(true);
  };

  const handleCommunicationSubmit = async (formData) => {
    try {
      console.log('Submitting communication:', formData); // Debug log
      await userDashboardService.logCommunication({
        ...formData,
        companyIds: selectedCompanies.map(c => c._id)
      });
      await fetchCompanies();
      setSelectedCompanies([]);
      setShowCommunicationModal(false);
    } catch (error) {
      console.error('Error logging communication:', error);
      setError('Failed to log communication');
    }
  };

  const handleScheduleCommunication = async (formData) => {
    try {
      setLoading(true); // Show loading state
      const companyId = selectedCompanyForSchedule?._id;
      if (!companyId) {
        setError('No company selected');
        return;
      }

      await userDashboardService.scheduleCommunication({
        companyId,
        type: formData.type,
        scheduledDate: formData.scheduledDate,
        notes: formData.notes
      });
      
      alert('Communication scheduled successfully!');
      setShowScheduleModal(false);
      setSelectedCompanyForSchedule(null);
      
      // Don't call fetchCompanies here since we don't need to reload the entire list
    } catch (error) {
      console.error('Error scheduling communication:', error);
      setError('Failed to schedule communication');
      alert('Failed to schedule communication');
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  const handleScheduleClick = (company) => {
    setSelectedCompanyForSchedule(company);
    setShowScheduleModal(true);
  };

  const handleQuickTest = async () => {
    const company = companies[0]; // Use first company
    if (!company) {
      alert('No companies available');
      return;
    }

    try {
      // Schedule one for now (will appear in Today's Communications)
      await userDashboardService.scheduleCommunication({
        companyId: company._id,
        type: 'email',
        scheduledDate: new Date().toISOString().split('T')[0],
        notes: 'Today test notification'
      });

      // Schedule one for yesterday (will appear in Overdue)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      await userDashboardService.scheduleCommunication({
        companyId: company._id,
        type: 'phone',
        scheduledDate: yesterday.toISOString().split('T')[0],
        notes: 'Overdue test notification'
      });

      alert('Test notifications created! Check the Notifications page.');
      await fetchCompanies();
    } catch (error) {
      console.error('Error creating test notifications:', error);
      alert('Failed to create test notifications');
    }
  };

  const handleQuickNotification = async (company) => {
    try {
      setLoading(true); // Show loading state
      if (!company._id) {
        alert('No company selected');
        return;
      }

      const result = await userDashboardService.createQuickNotifications(company._id);
      
      if (result.success) {
        alert('Test notifications created! Check the Notifications page.');
        // Don't call fetchCompanies here, just update the local state if needed
      } else {
        throw new Error(result.message || 'Failed to create notifications');
      }
    } catch (error) {
      console.error('Error creating notifications:', error);
      setError('Failed to create notifications');
      alert('Failed to create notifications. Please try again.');
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-600 mb-4">{error}</div>
        {error.includes('No companies found') && (
          <button
            onClick={() => navigate('/user/companies/add')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Company
          </button>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Companies
          </h1>
          <button
            onClick={() => navigate('/user/companies/add')}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Company
          </button>
          {selectedCompanies.length > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedCompanies.length} selected
            </span>
          )}
        </div>
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const company = companies[0];
              if (company) {
                setSelectedCompanyForSchedule(company);
                handleScheduleCommunication({
                  type: 'email',
                  scheduledDate: new Date().toISOString().split('T')[0],
                  notes: 'Quick test notification'
                });
              }
            }}
            className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-yellow-500 text-white hover:bg-yellow-600"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Quick Test Notification</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCommunicationClick}
            disabled={selectedCompanies.length === 0}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              selectedCompanies.length > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ClockIcon className="h-5 w-5" />
            <span>Communication Performed</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company, index) => (
          <motion.div
            key={company._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden
              ${company.highlightStatus === 'red' ? 'ring-2 ring-red-500' : ''}
              ${company.highlightStatus === 'yellow' ? 'ring-2 ring-yellow-500' : ''}
            `}
          >
            <div className="absolute top-4 right-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCompanies.some(c => c._id === company._id)}
                  onChange={() => handleCompanySelect(company)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </label>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-4">
                <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
                <h3 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
                  {company.name}
                </h3>
              </div>
              
              <div className="space-y-3">
                {company.emails && company.emails[0] && (
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <EnvelopeIcon className="h-5 w-5 mr-2" />
                    <span>{company.emails[0]}</span>
                  </div>
                )}
                {company.phoneNumbers && company.phoneNumbers[0] && (
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <PhoneIcon className="h-5 w-5 mr-2" />
                    <span>{company.phoneNumbers[0]}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Last Communication
                  </span>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {company.lastCommunication 
                      ? new Date(company.lastCommunication).toLocaleDateString()
                      : 'Never'}
                  </span>
                </div>
                {company.lastCommunicationType && (
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Type: {company.lastCommunicationType}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex space-x-2">
              <button
                onClick={() => handleScheduleClick(company)}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center justify-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Schedule
              </button>
              <button
                onClick={() => handleQuickNotification(company)}
                className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 flex items-center justify-center tooltip"
                title="Create test notifications"
              >
                <BellIcon className="h-4 w-4" />
                <span className="ml-2">Test</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {showScheduleModal && (
        <ScheduleCommunicationModal
          isOpen={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedCompanyForSchedule(null);
          }}
          company={selectedCompanyForSchedule}
          onSubmit={handleScheduleCommunication}
        />
      )}

      <CommunicationActionModal
        isOpen={showCommunicationModal}
        onClose={() => setShowCommunicationModal(false)}
        selectedCompanies={selectedCompanies}
        onSubmit={handleCommunicationSubmit}
      />
    </motion.div>
  );
};

export default Companies; 