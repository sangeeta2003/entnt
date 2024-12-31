// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import UserSidebar from '../components/user/UserSidebar';
// import Header from '../components/Header';
// import NotificationBadge from '../components/user/NotificationBadge';

// const UserLayout = () => {
//   return (
//     <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
//       <UserSidebar />
//       <div className="flex flex-col flex-1">
//         <Header />
//         <main className="flex-1 overflow-auto p-4">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default UserLayout; 

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import {
  HomeIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  BellIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const userNavItems = [
  {
    path: '/user/dashboard',
    name: 'Dashboard',
    icon: <HomeIcon className="w-5 h-5" />
  },
  {
    path: '/user/calendar',
    name: 'Calendar',
    icon: <CalendarIcon className="w-5 h-5" />
  },
  {
    path: '/user/companies',
    name: 'Companies',
    icon: <BuildingOfficeIcon className="w-5 h-5" />
  },
  {
    path: '/user/notifications',
    name: 'Notifications',
    icon: <BellIcon className="w-5 h-5" />
  },
  {
    path: '/user/analytics',
    name: 'Analytics',
    icon: <ChartBarIcon className="w-5 h-5" />
  }
];

const UserLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar navItems={userNavItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout; 

