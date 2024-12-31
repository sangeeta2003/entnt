import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { 
  XMarkIcon,
  VideoCameraIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useCompany } from '../context/CompanyContext';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';
import { sendNotifications } from '../services/NotificationService';

const NewCommunicationModal = ({ isOpen, onClose, initialDate }) => {
  const { companies, addCommunication } = useCompany();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    type: 'meeting',
    title: '',
    date: initialDate || new Date(),
    startTime: '',
    endTime: '',
    company: '',
    participants: [],
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create meeting URL if it's a video meeting
      const meetingUrl = formData.type === 'meeting' 
        ? `https://meet.yourapp.com/${Math.random().toString(36).substr(2, 9)}`
        : null;

      // Add communication
      const newCommunication = {
        ...formData,
        meetingUrl,
        createdAt: new Date().toISOString(),
        status: 'scheduled'
      };

      await addCommunication(newCommunication);

      try {
        // Send notifications (wrapped in try-catch to prevent it from blocking the main flow)
        await sendNotifications(newCommunication);
      } catch (notificationError) {
        console.error('Failed to send notifications:', notificationError);
        // Show warning toast but don't prevent the communication from being created
        setNotification({
          type: 'warning',
          message: 'Communication created but notifications could not be sent'
        });
        return;
      }

      // Show success message
      setNotification({
        type: 'success',
        message: 'Communication scheduled successfully!'
      });

      // Close modal after delay
      setTimeout(() => {
        onClose();
        navigate('/communications');
      }, 2000);

    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to schedule communication'
      });
    }
  };

  const handleParticipantsChange = (e) => {
    // Convert comma-separated string to array and trim whitespace
    const participantsArray = e.target.value.split(',').map(email => email.trim());
    setFormData({ ...formData, participants: participantsArray });
  };

  const communicationTypes = [
    { id: 'meeting', icon: VideoCameraIcon, label: 'Video Meeting' },
    { id: 'call', icon: PhoneIcon, label: 'Phone Call' },
    { id: 'email', icon: EnvelopeIcon, label: 'Email' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                New Communication
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Communication Type */}
              <div className="grid grid-cols-3 gap-4">
                {communicationTypes.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: id })}
                    className={`p-4 rounded-lg border-2 flex flex-col items-center space-y-2 ${
                      formData.type === id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    <Icon className={`h-6 w-6 ${
                      formData.type === id ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      formData.type === id ? 'text-blue-500' : 'text-gray-500'
                    }`}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <DatePicker
                    selected={formData.date}
                    onChange={(date) => setFormData({ ...formData, date })}
                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company
                </label>
                <select
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select a company</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Participants */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Participants
                </label>
                <input
                  type="text"
                  value={formData.participants.join(', ')}
                  onChange={handleParticipantsChange}
                  className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter participant emails (comma-separated)"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Communication
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewCommunicationModal; 