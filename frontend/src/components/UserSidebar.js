import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const UserSidebar = () => {
  const userLinks = [
    {
      name: 'Dashboard',
      to: '/',
      icon: HomeIcon
    },
    // Add more user navigation items here
  ];

  return (
    <nav className="p-4 space-y-1">
      {userLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
              isActive
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`
          }
        >
          <link.icon className="h-5 w-5 mr-3" />
          {link.name}
        </NavLink>
      ))}
    </nav>
  );
};

export default UserSidebar; 