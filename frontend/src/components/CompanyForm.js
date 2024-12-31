import React from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Company name is required'),
  location: Yup.string().required('Location is required'),
  linkedinProfile: Yup.string().url('Must be a valid URL'),
  emails: Yup.array().of(
    Yup.string().email('Invalid email').required('Email is required')
  ),
  phoneNumbers: Yup.array().of(
    Yup.string().required('Phone number is required')
  ),
  communicationPeriodicity: Yup.number()
    .min(1, 'Must be at least 1 day')
    .required('Periodicity is required')
});

const CompanyForm = ({ initialValues, onSubmit }) => {
  const defaultValues = {
    name: '',
    location: '',
    linkedinProfile: '',
    emails: [''],
    phoneNumbers: [''],
    comments: '',
    communicationPeriodicity: 14,
    ...initialValues
  };

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched }) => (
        <Form className="space-y-6 bg-white p-8 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <Field
              name="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              type="text"
            />
            {errors.name && touched.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <Field
              name="location"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              type="text"
            />
            {errors.location && touched.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              LinkedIn Profile
            </label>
            <Field
              name="linkedinProfile"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              type="url"
            />
            {errors.linkedinProfile && touched.linkedinProfile && (
              <p className="mt-1 text-sm text-red-600">{errors.linkedinProfile}</p>
            )}
          </div>

          <FieldArray name="emails">
            {({ push, remove }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Addresses
                </label>
                {values.emails.map((email, index) => (
                  <div key={index} className="flex mt-2 gap-2">
                    <Field
                      name={`emails.${index}`}
                      type="email"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => push('')}
                  className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Email
                </button>
              </div>
            )}
          </FieldArray>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Communication Periodicity (days)
            </label>
            <Field
              name="communicationPeriodicity"
              type="number"
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Comments
            </label>
            <Field
              name="comments"
              as="textarea"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Company
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CompanyForm; 