// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import {
//   HomeIcon,
//   CalendarIcon,
//   BuildingOfficeIcon,
//   ChatBubbleLeftRightIcon,
//   BellIcon,
//   ChartBarIcon
// } from '@heroicons/react/24/outline';

// const navigationItems = {
//   admin: [
//     {
//       path: '/admin/dashboard',
//       name: 'Dashboard',
//       icon: <HomeIcon className="w-5 h-5" />
//     },
//     // ... other admin items
//   ],
//   user: [
//     {
//       path: '/user/dashboard',
//       name: 'Dashboard',
//       icon: <HomeIcon className="w-5 h-5" />
//     },
//     {
//       path: '/user/calendar',
//       name: 'Calendar',
//       icon: <CalendarIcon className="w-5 h-5" />
//     },
//     {
//       path: '/user/companies',
//       name: 'Companies',
//       icon: <BuildingOfficeIcon className="w-5 h-5" />
//     },
//     {
//       path: '/user/communications',
//       name: 'Communications',
//       icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />
//     },
//     {
//       path: '/user/notifications',
//       name: 'Notifications',
//       icon: <BellIcon className="w-5 h-5" />
//     },
//     {
//       path: '/user/analytics',
//       name: 'Analytics',
//       icon: <ChartBarIcon className="w-5 h-5" />
//     }
//   ]
// }; 
import { useAuth } from '../../context/AuthContext';
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ navItems }) => {
  const { user } = useAuth();

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
      <div className="h-16 flex items-center justify-center border-b dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {user?.role === 'admin' ? 'Admin Panel' : 'User Dashboard'}
        </h1>
      </div>
      <nav className="mt-5">
        <div className="px-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`
              }
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar; 