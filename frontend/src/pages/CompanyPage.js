import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BuildingOfficeIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ChevronDownIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  UsersIcon,
  CalendarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { useCompany } from '../context/CompanyContext';

const CompanyCard = ({ company, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
  >
    <div className="p-6">
      {/* Company Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          {company.logo ? (
            <img 
              src={company.logo} 
              alt={company.name}
              className="h-16 w-16 rounded-lg object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {company.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="ml-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {company.name}
            </h3>
            <div className="flex items-center mt-1">
              <MapPinIcon className="h-4 w-4 text-gray-400" />
              <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                {company.location}
              </span>
            </div>
          </div>
        </div>
        <motion.div 
          initial={false}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className={`px-3 py-1 rounded-full ${
            company.status === 'active' 
              ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
              : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400'
          }`}
        >
          {company.status}
        </motion.div>
      </div>

      {/* Company Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="flex items-center">
            <UsersIcon className="h-5 w-5 text-blue-500" />
            <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              Employees
            </span>
          </div>
          <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
            {company.employeeCount || '0'}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 text-green-500" />
            <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              Meetings
            </span>
          </div>
          <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
            {company.meetingsCount || '0'}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full dark:text-blue-400 dark:hover:bg-blue-900"
          >
            <PhoneIcon className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full dark:text-blue-400 dark:hover:bg-blue-900"
          >
            <EnvelopeIcon className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full dark:text-blue-400 dark:hover:bg-blue-900"
          >
            <GlobeAltIcon className="h-5 w-5" />
          </motion.button>
        </div>
        <Link
          to={`/companies/edit/${company.id}`}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View Details
          <ChevronDownIcon className="ml-1 h-4 w-4 rotate-[-90deg]" />
        </Link>
      </div>
    </div>
  </motion.div>
);

const CompanyPage = () => {
  const { companies } = useCompany();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // Stats data
  const stats = [
    {
      title: 'Total Companies',
      value: companies.length,
      icon: BuildingOfficeIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Companies',
      value: companies.filter(c => c.status === 'active').length,
      icon: ChartBarIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Total Meetings',
      value: companies.reduce((acc, curr) => acc + (curr.meetingsCount || 0), 0),
      icon: CalendarIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Employees',
      value: companies.reduce((acc, curr) => acc + (curr.employeeCount || 0), 0),
      icon: UsersIcon,
      color: 'bg-indigo-500'
    }
  ];

  const filteredCompanies = companies
    .filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || company.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'lastContact') return new Date(b.lastContact) - new Date(a.lastContact);
      return 0;
    });

  const handleExport = () => {
    // Implement CSV export
    console.log('Exporting companies...');
  };

  const handleSort = (newSortBy) => {
    setSortBy(newSortBy);
    // Implement sorting logic here
  };

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'lastContact', label: 'Last Contact' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Header with Stats */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Companies
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage and track your business relationships
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 sm:mt-0"
          >
            <Link
              to="/companies/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Company
            </Link>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`rounded-md p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {stat.title}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {stat.value}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600"
          >
            <div className="flex items-center">
              <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-200">Filter by Status</span>
            </div>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </button>

          <AnimatePresence>
            {isFilterMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 mt-2 w-full rounded-lg bg-white dark:bg-gray-700 shadow-lg"
              >
                <div className="py-1">
                  {['all', 'active', 'inactive'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setFilterStatus(status);
                        setIsFilterMenuOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm ${
                        filterStatus === status
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                          : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
          Export Companies
        </button>

        <div className="relative">
          <button
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600"
          >
            <div className="flex items-center">
              <ChevronDownIcon className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-200">
                Sort by: {sortOptions.find(opt => opt.value === sortBy)?.label}
              </span>
            </div>
          </button>

          <AnimatePresence>
            {isFilterMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 mt-2 w-full rounded-lg bg-white dark:bg-gray-700 shadow-lg"
              >
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      handleSort(option.value);
                      setIsFilterMenuOpen(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm ${
                      sortBy === option.value
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Company Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredCompanies.map((company, index) => (
            <CompanyCard key={company.id} company={company} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredCompanies.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No companies found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by adding a new company.
          </p>
          <div className="mt-6">
            <Link
              to="/companies/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Company
            </Link>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CompanyPage; 