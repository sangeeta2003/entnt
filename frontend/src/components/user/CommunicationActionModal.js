import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

const COMMUNICATION_TYPES = [
  { id: 'linkedin', name: 'LinkedIn Post' },
  { id: 'email', name: 'Email' },
  { id: 'phone', name: 'Phone Call' },
  { id: 'meeting', name: 'Meeting' }
];

const CommunicationActionModal = ({ isOpen, onClose, selectedCompanies, onSubmit }) => {
  const [formData, setFormData] = useState({
    type: 'email',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.type) {
        throw new Error('Communication type is required');
      }

      if (!selectedCompanies || selectedCompanies.length === 0) {
        throw new Error('No companies selected');
      }

      const data = {
        companyIds: selectedCompanies.map(company => company._id),
        type: formData.type,
        date: formData.date,
        notes: formData.notes,
        status: 'completed'
      };

      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error submitting communication:', error);
      // You might want to show this error to the user
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center">
        <Dialog.Overlay 
          className="fixed inset-0 bg-black/30"
          aria-hidden="false"
        />

        <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            aria-label="Close dialog"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
              Communication Performed
            </Dialog.Title>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selected Companies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Selected Companies ({selectedCompanies.length})
              </label>
              <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                {selectedCompanies.map(company => company.name).join(', ')}
              </div>
            </div>

            {/* Communication Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="meeting">Meeting</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>

            {/* Communication Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date of Communication *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter any additional comments about the communication..."
              />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Submit Communication
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default CommunicationActionModal; 