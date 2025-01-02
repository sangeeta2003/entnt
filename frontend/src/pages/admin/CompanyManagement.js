import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BuildingOfficeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  LinkIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useCompany } from '../../context/CompanyContext';
import Toast from '../../components/Toast';

const CompanyManagement = () => {
  const { 
    companies, 
    loading, 
    error, 
    pagination,
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany 
  } = useCompany();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [notification, setNotification] = useState(null);

  const initialFormData = {
    name: '',
    location: '',
    linkedinProfile: '',
    emails: [''],
    phoneNumbers: [''],
    comments: '',
    communicationPeriodicity: 14 // Default to 2 weeks
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleAddEmail = () => {
    setFormData(prev => ({
      ...prev,
      emails: [...prev.emails, '']
    }));
  };

  const handleAddPhone = () => {
    setFormData(prev => ({
      ...prev,
      phoneNumbers: [...prev.phoneNumbers, '']
    }));
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...formData.emails];
    newEmails[index] = value;
    setFormData(prev => ({
      ...prev,
      emails: newEmails
    }));
  };

  const handlePhoneChange = (index, value) => {
    const newPhones = [...formData.phoneNumbers];
    newPhones[index] = value;
    setFormData(prev => ({
      ...prev,
      phoneNumbers: newPhones
    }));
  };

  const handleRemoveEmail = (index) => {
    setFormData(prev => ({
      ...prev,
      emails: prev.emails.filter((_, i) => i !== index)
    }));
  };

  const handleRemovePhone = (index) => {
    setFormData(prev => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const companyData = {
        ...formData,
        // Convert periodicity to string
        communicationPeriodicity: formData.communicationPeriodicity.toString()
      };

      if (editingCompany) {
        await updateCompany(editingCompany.id, companyData);
        setNotification({ type: 'success', message: 'Company updated successfully' });
      } else {
        await createCompany(companyData);
        setNotification({ type: 'success', message: 'Company added successfully' });
      }
      setIsModalOpen(false);
      setFormData(initialFormData);
      setEditingCompany(null);
    } catch (error) {
      setNotification({ type: 'error', message: error.message });
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      location: company.location,
      linkedinProfile: company.linkedinProfile,
      emails: company.emails,
      phoneNumbers: company.phoneNumbers,
      comments: company.comments,
      communicationPeriodicity: company.communicationPeriodicity
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (company) => {
    try {
      if (window.confirm('Are you sure you want to delete this company?')) {
        console.log('Deleting company:', company._id);
        await deleteCompany(company._id);
        setNotification({ type: 'success', message: 'Company deleted successfully' });
      }
    } catch (error) {
      console.error('Delete error:', error);
      setNotification({ type: 'error', message: error.message });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Company Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add and manage company information
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCompany(null);
            setFormData(initialFormData);
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Company
        </button>
      </div>

      {/* Company List */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Company
                </th>
                <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <BuildingOfficeIcon className="h-10 w-10 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {company.name}
                        </div>
                        <div className="sm:hidden text-xs text-gray-500">
                          {company.location}
                        </div>
                        {company.linkedinProfile && (
                          <a
                            href={company.linkedinProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-500"
                          >
                            <LinkIcon className="h-3 w-3 inline mr-1" />
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {company.location}
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-4 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {company.emails[0] && (
                        <div className="flex items-center">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          <span className="truncate max-w-[200px]">{company.emails[0]}</span>
                        </div>
                      )}
                      {company.phoneNumbers[0] && (
                        <div className="flex items-center mt-1">
                          <PhoneIcon className="h-4 w-4 mr-1" />
                          {company.phoneNumbers[0]}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {company.communicationPeriodicity}d
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(company)}
                      className="text-blue-600 hover:text-blue-900 p-2"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(company)}
                      className="text-red-600 hover:text-red-900 p-2"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Company Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg mx-4 p-4 sm:p-6"
          >
            <h2 className="text-lg font-semibold mb-4">
              {editingCompany ? 'Edit Company' : 'Add New Company'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form fields remain the same but with improved mobile spacing */}
              <div className="space-y-4">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg"
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-lg"
                    required
                  />
                </div>

                {/* LinkedIn Profile */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={formData.linkedinProfile}
                    onChange={(e) => setFormData({ ...formData, linkedinProfile: e.target.value })}
                    className="w-full rounded-lg"
                  />
                </div>

                {/* Emails */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email Addresses
                  </label>
                  {formData.emails.map((email, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => handleEmailChange(index, e.target.value)}
                        className="w-full rounded-lg"
                        required
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveEmail(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddEmail}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    + Add another email
                  </button>
                </div>

                {/* Phone Numbers */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone Numbers
                  </label>
                  {formData.phoneNumbers.map((phone, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => handlePhoneChange(index, e.target.value)}
                        className="w-full rounded-lg"
                        required
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePhone(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddPhone}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    + Add another phone number
                  </button>
                </div>

                {/* Communication Periodicity */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Communication Periodicity (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.communicationPeriodicity}
                    onChange={(e) => setFormData({ ...formData, communicationPeriodicity: parseInt(e.target.value) })}
                    className="w-full rounded-lg"
                    required
                  />
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Comments
                  </label>
                  <textarea
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    rows={4}
                    className="w-full rounded-lg"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingCompany ? 'Update Company' : 'Add Company'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Toast notification remains unchanged */}
      {notification && (
        <Toast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </motion.div>
  );
};

export default CompanyManagement; 