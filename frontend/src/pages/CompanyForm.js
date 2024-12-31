import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useCompany } from '../context/CompanyContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  BuildingOfficeIcon,
  MapPinIcon,
  GlobeAltIcon,
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import Toast from '../components/Toast';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Company name is required'),
  location: Yup.string().required('Location is required'),
  website: Yup.string().url('Must be a valid URL'),
  industry: Yup.string().required('Industry is required'),
  employeeCount: Yup.number().min(0, 'Must be a positive number'),
  email: Yup.string().email('Invalid email'),
  phone: Yup.string(),
  description: Yup.string()
});

const CompanyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addCompany, updateCompany, companies } = useCompany();
  const [notification, setNotification] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      location: '',
      website: '',
      industry: '',
      employeeCount: '',
      email: '',
      phone: '',
      description: '',
      logo: null
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (id) {
          await updateCompany(id, values);
          setNotification({ type: 'success', message: 'Company updated successfully!' });
        } else {
          await addCompany(values);
          setNotification({ type: 'success', message: 'Company created successfully!' });
        }
        
        setTimeout(() => {
          navigate('/companies');
        }, 2000);
      } catch (error) {
        setNotification({ type: 'error', message: error.message });
      }
    }
  });

  useEffect(() => {
    if (id) {
      const company = companies.find(c => c.id === id);
      if (company) {
        formik.setValues(company);
        setLogoPreview(company.logo);
      }
    }
  }, [id, companies]);

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        formik.setFieldValue('logo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {id ? 'Edit Company' : 'Add New Company'}
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company Logo
            </label>
            <div className="flex items-center space-x-4">
              {logoPreview ? (
                <div className="relative">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLogoPreview(null);
                      formik.setFieldValue('logo', null);
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                  >
                    <PhotoIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="h-16 w-16 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <PhotoIcon className="h-8 w-8" />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company Name
              </label>
              <input
                type="text"
                {...formik.getFieldProps('name')}
                className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                {...formik.getFieldProps('location')}
                className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {formik.touched.location && formik.errors.location && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.location}</p>
              )}
            </div>

            {/* Add other fields similarly */}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                {...formik.getFieldProps('email')}
                className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                {...formik.getFieldProps('phone')}
                className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              {...formik.getFieldProps('description')}
              rows={4}
              className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/companies')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {id ? 'Update Company' : 'Add Company'}
            </button>
          </div>
        </form>
      </div>

      {/* Notification Toast */}
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

export default CompanyForm; 