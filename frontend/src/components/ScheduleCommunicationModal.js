import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { userDashboardService } from '../services/userDashboardService';

const ScheduleCommunicationModal = ({ company, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: '',
    scheduledDate: null,
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form data
      if (!formData.type || !formData.scheduledDate) {
        throw new Error('Please fill in all required fields');
      }

      const data = {
        companyId: company._id,
        type: formData.type,
        scheduledDate: formData.scheduledDate,
        description: formData.description
      };

      await userDashboardService.scheduleCommunication(data);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to schedule communication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Schedule Communication for {company.name}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select type</option>
              <option value="email">Email</option>
              <option value="phone">Phone Call</option>
              <option value="meeting">Meeting</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scheduled Date *
            </label>
            <DatePicker
              selected={formData.scheduledDate}
              onChange={(date) => setFormData({ ...formData, scheduledDate: date })}
              className="w-full px-3 py-2 border rounded-md"
              dateFormat="MMMM d, yyyy"
              minDate={new Date()}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              rows="3"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleCommunicationModal; 