import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { ArrowDownTrayIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { analyticsService } from '../../services/analyticsService';
import DateRangePicker from '../../components/common/DateRangePicker';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [communicationData, setCommunicationData] = useState(null);
  const [engagementData, setEngagementData] = useState(null);
  const [overdueData, setOverdueData] = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange, selectedCompany]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getAnalyticsData({
        startDate: dateRange.start,
        endDate: dateRange.end,
        companyId: selectedCompany === 'all' ? null : selectedCompany
      });

      setCommunicationData(data.communicationFrequency);
      setEngagementData(data.engagementEffectiveness);
      setOverdueData(data.overduetrends);
      setActivityLog(data.activityLog);
      setCompanies(data.companies);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (format) => {
    try {
      const report = await analyticsService.generateReport({
        format,
        startDate: dateRange.start,
        endDate: dateRange.end,
        companyId: selectedCompany === 'all' ? null : selectedCompany
      });

      // Handle the downloaded file
      const url = window.URL.createObjectURL(new Blob([report]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Analytics Dashboard
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <DateRangePicker
            startDate={dateRange.start}
            endDate={dateRange.end}
            onChange={setDateRange}
            className="w-72"
          />

          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-800 px-4 py-2"
          >
            <option value="all">All Companies</option>
            {companies.map(company => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>

          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => downloadReport('pdf')}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg
                       hover:bg-indigo-700 transition-colors"
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              PDF Report
            </button>
            <button
              onClick={() => downloadReport('csv')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg
                       hover:bg-green-700 transition-colors"
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              CSV Export
            </button>
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Communication Frequency Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Communication Frequency</h2>
          <Bar data={communicationData} options={chartOptions.bar} />
        </motion.div>

        {/* Engagement Effectiveness Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Engagement Effectiveness</h2>
          <Pie data={engagementData} options={chartOptions.pie} />
        </motion.div>

        {/* Overdue Trends Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg md:col-span-2"
        >
          <h2 className="text-xl font-semibold mb-4">Overdue Communication Trends</h2>
          <Line data={overdueData} options={chartOptions.line} />
        </motion.div>
      </div>

      {/* Activity Log */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Real-Time Activity Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b dark:border-gray-700">
                <th className="pb-3">Date</th>
                <th className="pb-3">User</th>
                <th className="pb-3">Company</th>
                <th className="pb-3">Action</th>
                <th className="pb-3">Type</th>
              </tr>
            </thead>
            <tbody>
              {activityLog.map((activity) => (
                <tr key={activity._id} className="border-b dark:border-gray-700">
                  <td className="py-3">{format(new Date(activity.date), 'MMM d, yyyy HH:mm')}</td>
                  <td className="py-3">{activity.user}</td>
                  <td className="py-3">{activity.company}</td>
                  <td className="py-3">{activity.action}</td>
                  <td className="py-3">{activity.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

// Chart configuration options
const chartOptions = {
  bar: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Communication Methods Distribution'
      }
    }
  },
  pie: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Engagement Success Rate'
      }
    }
  },
  line: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Overdue Communications Over Time'
      }
    }
  }
};

export default AnalyticsDashboard; 