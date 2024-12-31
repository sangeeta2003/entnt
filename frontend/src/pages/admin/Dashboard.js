import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UsersIcon, 
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  PhoneIcon,
  VideoCameraIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { dashboardService } from '../../services/dashboardService';
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
  Legend
);

const OverdueTrendsChart = ({ data }) => {
  if (!data?.overdueTrends) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Overdue Communications by Company
      </h2>
      <div className="h-64">
        <Line
          data={data.overdueTrends}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Number of Overdue Communications'
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => `Overdue: ${context.raw}`
                }
              }
            }
          }}
        />
      </div>
    </motion.div>
  );
};

const CommunicationEffectivenessChart = ({ data }) => {
  if (!data?.communicationEffectiveness) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Communication Method Effectiveness
      </h2>
      <div className="h-64">
        <Bar
          data={data.communicationEffectiveness}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Response Rate & Time'
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.dataset.label;
                    const value = context.raw;
                    return label.includes('Rate') 
                      ? `${label}: ${value}%`
                      : `${label}: ${value} days`;
                  }
                }
              }
            }
          }}
        />
      </div>
    </motion.div>
  );
};

const getActivityIcon = (type) => {
  const iconMap = {
    email: EnvelopeIcon,
    phone: PhoneIcon,
    meeting: VideoCameraIcon,
    linkedin: LinkIcon,
    default: ChatBubbleLeftRightIcon
  };
  return iconMap[type] || iconMap.default;
};

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState('week');
  const [communicationsData, setCommunicationsData] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // for activity log sorting
  const [companies, setCompanies] = useState([]);
  const [downloadStatus, setDownloadStatus] = useState({ loading: false, error: null });
  const [communicationMethod, setCommunicationMethod] = useState('all');
  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const params = {
        startDate: dateRange.start,
        endDate: dateRange.end,
        companyId: selectedCompany,
        communicationType: communicationMethod
      };
      
      const data = await dashboardService.getDashboardData(params);
      setCommunicationsData(data);
      updateFilteredData(data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange.start, dateRange.end, selectedCompany, communicationMethod]);

  const updateFilteredData = (data) => {
    if (!data) return;

    const filtered = {
      ...data,
      communicationFrequency: {
        labels: data.communicationFrequency.labels,
        datasets: [{
          ...data.communicationFrequency.datasets[0],
          data: data.communicationFrequency.datasets[0].data
        }]
      }
    };

    setFilteredData(filtered);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await dashboardService.updateCommunicationStatus(id, status);
      await fetchDashboardData();
    } catch (err) {
      console.error('Error updating status:', err);
      // Use your existing error handling
    }
  };

  const handleHighlightToggle = async (id) => {
    try {
      await dashboardService.toggleHighlight(id);
      await fetchDashboardData();
    } catch (err) {
      console.error('Error toggling highlight:', err);
      // Use your existing error handling
    }
  };

  const stats = [
    {
      name: 'Total Users',
      value: '2,345',
      icon: UsersIcon,
      change: '+12%',
      changeType: 'increase',
      color: 'bg-blue-500'
    },
    {
      name: 'Active Companies',
      value: '145',
      icon: BuildingOfficeIcon,
      change: '+5%',
      changeType: 'increase',
      color: 'bg-green-500'
    },
    {
      name: 'Communications',
      value: '12,456',
      icon: ChatBubbleLeftRightIcon,
      change: '+23%',
      changeType: 'increase',
      color: 'bg-purple-500'
    },
    {
      name: 'Engagement Rate',
      value: '84%',
      icon: ChartBarIcon,
      change: '-2%',
      changeType: 'decrease',
      color: 'bg-orange-500'
    }
  ];

  const activityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Communications',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(99, 102, 241)',
        tension: 0.1
      }
    ]
  };

  const companyEngagement = {
    labels: ['Email', 'LinkedIn', 'Phone', 'Meeting', 'Other'],
    datasets: [
      {
        data: [300, 250, 200, 150, 100],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(156, 163, 175, 0.8)'
        ]
      }
    ]
  };

  const recentActivities = [
    {
      id: 1,
      type: 'communication',
      company: 'Tech Corp',
      action: 'Email sent',
      time: '2 hours ago',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 2,
      type: 'meeting',
      company: 'Global Industries',
      action: 'Meeting scheduled',
      time: '4 hours ago',
      icon: CalendarIcon,
      color: 'bg-green-100 text-green-600'
    },
    // Add more activities as needed
  ];

  const FilterControls = () => (
    <div className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date Range
          </label>
          <div className="flex gap-2">
            <DatePicker
              selected={dateRange.start}
              onChange={(date) => setDateRange({ ...dateRange, start: date })}
              className="w-full px-3 py-2 border rounded-md"
              placeholderText="Start Date"
            />
            <DatePicker
              selected={dateRange.end}
              onChange={(date) => setDateRange({ ...dateRange, end: date })}
              className="w-full px-3 py-2 border rounded-md"
              placeholderText="End Date"
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Company
          </label>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="all">All Companies</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Communication Method
          </label>
          <select
            value={communicationMethod}
            onChange={(e) => setCommunicationMethod(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="all">All Methods</option>
            <option value="email">Email</option>
            <option value="linkedin">LinkedIn</option>
            <option value="phone">Phone</option>
            <option value="meeting">Meeting</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Download buttons */}
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => handleDownload('pdf')}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg
                     hover:bg-indigo-700 transition-colors"
          >
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            PDF Report
          </button>
          <button
            onClick={() => handleDownload('csv')}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg
                     hover:bg-green-700 transition-colors"
          >
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            CSV Export
          </button>
        </div>
      </div>
    </div>
  );

  const engagementData = {
    labels: ['Email', 'LinkedIn', 'Phone', 'Meeting'],
    datasets: [
      {
        label: 'Response Rate',
        data: [75, 68, 82, 90],
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      }
    ]
  };

  const overdueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Overdue Communications',
        data: [12, 19, 15, 8, 10, 5],
        borderColor: 'rgb(239, 68, 68)',
        tension: 0.1
      }
    ]
  };

  const handleDownload = async (format) => {
    setDownloadStatus({ loading: true, error: null });
    try {
      await dashboardService.downloadReport({
        format,
        startDate: dateRange.start,
        endDate: dateRange.end,
        companyId: selectedCompany,
        reportType: 'analytics'
      });
      setDownloadStatus({ loading: false, error: null });
      // Show success message
      alert('Report downloaded successfully!');
    } catch (error) {
      setDownloadStatus({ loading: false, error: error.message });
      alert('Failed to download report. Please try again.');
    }
  };

  const DownloadSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Download Reports
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Export your analytics data in different formats
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => handleDownload('pdf')}
            disabled={downloadStatus.loading}
            className={`flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg
                     hover:bg-indigo-700 transition-colors ${
                       downloadStatus.loading ? 'opacity-50 cursor-not-allowed' : ''
                     }`}
          >
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            {downloadStatus.loading ? 'Downloading...' : 'Download PDF Report'}
          </button>
          <button
            onClick={() => handleDownload('csv')}
            disabled={downloadStatus.loading}
            className={`flex items-center px-6 py-3 bg-green-600 text-white rounded-lg
                     hover:bg-green-700 transition-colors ${
                       downloadStatus.loading ? 'opacity-50 cursor-not-allowed' : ''
                     }`}
          >
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            {downloadStatus.loading ? 'Downloading...' : 'Download CSV Export'}
          </button>
        </div>
      </div>
      {downloadStatus.error && (
        <p className="mt-2 text-red-600 text-sm">{downloadStatus.error}</p>
      )}
    </motion.div>
  );

  const CommunicationFrequencyChart = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Communication Methods Frequency
      </h2>
      <div className="h-64">
        {filteredData ? (
          <Bar
            data={filteredData.communicationFrequency}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `Count: ${context.raw}`;
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Number of Communications'
                  }
                }
              }
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading data...</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  const EngagementMetricsSection = ({ data }) => {
    if (!data?.detailedMetrics) return null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Response Rate Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Communication Response Rates
          </h2>
          <div className="h-64">
            <Bar
              data={data.engagementEffectiveness}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      callback: value => `${value}%`
                    }
                  }
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => `Response Rate: ${context.raw}%`
                    }
                  }
                }
              }}
            />
          </div>
        </motion.div>

        {/* Detailed Metrics Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Detailed Engagement Metrics
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Response Rate
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Completed
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Pending
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.detailedMetrics.map((metric, idx) => (
                  <tr key={metric.method} className={idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : ''}>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white capitalize">
                      {metric.method}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {metric.responseRate.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {metric.completedCount}/{metric.totalCount}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {metric.pendingCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    );
  };

  const ActivityLogSection = ({ data, sortBy, setSortBy }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredActivities, setFilteredActivities] = useState([]);

    useEffect(() => {
      if (!data?.activityLog) return;
      
      const filtered = data.activityLog.filter(activity => 
        activity.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.user.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setFilteredActivities(filtered);
    }, [data, searchTerm]);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow"
      >
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Real-Time Activity Log
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
                <MagnifyingGlassIcon className="h-5 w-5 absolute right-3 top-2.5 text-gray-400" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="date">Sort by Date</option>
                <option value="company">Sort by Company</option>
                <option value="type">Sort by Type</option>
                <option value="user">Sort by User</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden">
            <div className="align-middle inline-block min-w-full">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredActivities.map((activity, idx) => {
                      const ActivityIcon = getActivityIcon(activity.type.toLowerCase());
                      return (
                        <motion.tr 
                          key={activity.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                activity.type === 'email' ? 'bg-blue-100 text-blue-600' :
                                activity.type === 'meeting' ? 'bg-green-100 text-green-600' :
                                activity.type === 'phone' ? 'bg-yellow-100 text-yellow-600' :
                                activity.type === 'linkedin' ? 'bg-blue-100 text-blue-600' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                <ActivityIcon className="h-4 w-4" />
                              </span>
                              <span className="ml-2 text-sm text-gray-900 dark:text-white capitalize">
                                {activity.type}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {activity.company}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {activity.user}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                              activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {activity.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {activity.time}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track your company communications and engagement metrics
        </p>
      </div>

      {/* Add Filter Controls */}
      <FilterControls />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <motion.div
            key={stat.name}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.changeType === 'increase' ? (
                          <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                        )}
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <CommunicationFrequencyChart />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Communication Activity
          </h2>
          <div className="h-64">
            <Line 
              data={activityData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Communication Methods
          </h2>
          <div className="h-64">
            <Bar
              data={companyEngagement}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Add Engagement Effectiveness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Engagement Effectiveness
          </h2>
          <div className="h-64">
            <Bar data={engagementData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    callback: value => `${value}%`
                  }
                }
              }
            }} />
          </div>
        </motion.div>

        {/* Add Overdue Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Overdue Communication Trends
          </h2>
          <div className="h-64">
            <Line data={overdueData} options={{
              responsive: true,
              maintainAspectRatio: false
            }} />
          </div>
        </motion.div>
      </div>

      {/* Replace the old activity log with the new one */}
      <ActivityLogSection 
        data={filteredData}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <DownloadSection />

      {/* Add Engagement Metrics Section */}
      <EngagementMetricsSection data={filteredData} />

      {/* Add new metrics section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <OverdueTrendsChart data={filteredData} />
        <CommunicationEffectivenessChart data={filteredData} />
      </div>
    </motion.div>
  );
};

export default Dashboard; 