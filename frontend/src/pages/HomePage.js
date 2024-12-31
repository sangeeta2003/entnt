import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { 
  ChartBarIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon,
  VideoCameraIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  PlusIcon,
  ArrowRightIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import NewCommunicationModal from '../components/NewCommunicationModal';

const ActivityItem = ({ activity }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="relative pb-8"
  >
    <div className="relative flex items-start space-x-3">
      <div className={`relative px-1 ${
        activity.type === 'meeting' ? 'bg-blue-100' :
        activity.type === 'call' ? 'bg-green-100' :
        'bg-yellow-100'
      } rounded-full`}>
        {activity.type === 'meeting' ? <VideoCameraIcon className="h-5 w-5 text-blue-600" /> :
         activity.type === 'call' ? <PhoneIcon className="h-5 w-5 text-green-600" /> :
         <EnvelopeIcon className="h-5 w-5 text-yellow-600" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {activity.title}
        </div>
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          <span>{activity.description}</span>
        </div>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <ClockIcon className="h-4 w-4 mr-1" />
          {activity.time}
        </div>
      </div>
    </div>
  </motion.div>
);

const QuickAction = ({ icon: Icon, title, onClick, color }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`${color} p-4 rounded-xl flex items-center space-x-3 w-full`}
  >
    <Icon className="h-6 w-6 text-white" />
    <span className="text-white font-medium">{title}</span>
  </motion.button>
);

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const stats = [
    {
      title: 'Total Meetings',
      value: '24',
      icon: CalendarIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Companies',
      value: '12',
      icon: BuildingOfficeIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Team Members',
      value: '8',
      icon: UserGroupIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Completion Rate',
      value: '92%',
      icon: ChartBarIcon,
      color: 'bg-indigo-500'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'meeting',
      title: 'Video Call with Tech Corp',
      description: 'Quarterly review meeting with Tech Corp team',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'call',
      title: 'Sales Call',
      description: 'Follow-up call with potential client',
      time: '4 hours ago'
    },
    {
      id: 3,
      type: 'email',
      title: 'Project Update',
      description: 'Sent weekly project status update',
      time: '6 hours ago'
    }
  ];

  const quickActions = [
    {
      title: 'Schedule Meeting',
      icon: VideoCameraIcon,
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => setShowNewEventModal(true)
    },
    {
      title: 'Add Company',
      icon: BuildingOfficeIcon,
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => navigate('/companies/new')
    },
    {
      title: 'View Analytics',
      icon: ChartBarIcon,
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => navigate('/analytics')
    }
  ];

  const handleDateSelect = (selectInfo) => {
    setSelectedDate(selectInfo.start);
    setShowNewEventModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Here's what's happening with your schedule today
        </p>
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Calendar</h2>
              <button
                onClick={() => setShowNewEventModal(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Event
              </button>
            </div>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              selectable={true}
              select={handleDateSelect}
              height="auto"
            />
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <QuickAction {...action} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
              <button
                onClick={() => navigate('/communications')}
                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 flex items-center"
              >
                View all
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="flow-root">
              <div className="-mb-8">
                {recentActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Event Modal */}
      {showNewEventModal && (
        <NewCommunicationModal
          isOpen={showNewEventModal}
          onClose={() => setShowNewEventModal(false)}
          initialDate={selectedDate}
        />
      )}

      <Link
        to="/admin"
        className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
      >
        <Cog6ToothIcon className="h-6 w-6" />
      </Link>
    </motion.div>
  );
};

export default HomePage; 