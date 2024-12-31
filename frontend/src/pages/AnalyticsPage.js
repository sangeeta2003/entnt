import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  CalendarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StatCard = ({ title, value, change, changeType, icon: Icon }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${
          changeType === 'increase' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
        </div>
      </div>
      <div className={`flex items-center ${
        changeType === 'increase' ? 'text-green-600' : 'text-red-600'
      }`}>
        {changeType === 'increase' ? (
          <ArrowUpIcon className="h-4 w-4" />
        ) : (
          <ArrowDownIcon className="h-4 w-4" />
        )}
        <span className="ml-1 text-sm font-medium">{change}%</span>
      </div>
    </div>
  </motion.div>
);

const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState([new Date().setMonth(new Date().getMonth() - 1), new Date()]);
  const [startDate, endDate] = dateRange;
  const [chartType, setChartType] = useState('line');

  const stats = [
    {
      title: 'Total Meetings',
      value: '2,345',
      change: '12.5',
      changeType: 'increase',
      icon: CalendarIcon
    },
    {
      title: 'Active Companies',
      value: '145',
      change: '8.2',
      changeType: 'increase',
      icon: BuildingOfficeIcon
    },
    {
      title: 'Team Members',
      value: '48',
      change: '2.3',
      changeType: 'decrease',
      icon: UserGroupIcon
    },
    {
      title: 'Completion Rate',
      value: '92%',
      change: '5.1',
      changeType: 'increase',
      icon: ChartBarIcon
    }
  ];

  const communicationData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Meetings',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Calls',
        data: [28, 48, 40, 19, 86, 27],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
      }
    ]
  };

  const companyEngagementData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      data: [45, 35, 20],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ]
    }]
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting data...');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track your team's performance and engagement
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-4">
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            className="form-input"
            placeholderText="Select date range"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            Export Data
          </motion.button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Communication Trends */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Communication Trends
              </h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <ArrowPathIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            {chartType === 'line' ? (
              <Line
                data={communicationData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
                height={300}
              />
            ) : (
              <Bar
                data={communicationData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
                height={300}
              />
            )}
          </motion.div>
        </div>

        {/* Company Engagement */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Company Engagement
            </h2>
            <Doughnut
              data={companyEngagementData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
              height={300}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsPage; 