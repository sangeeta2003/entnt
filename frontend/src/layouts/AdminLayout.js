// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import AdminSidebar from '../components/AdminSidebar';
// import Logo from '../components/Logo';
// import { motion } from 'framer-motion';

// const AdminLayout = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
//       <AdminSidebar />
//       <div className="lg:pl-64">
//         <motion.div 
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm"
//         >
//           <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
//             <Logo />
//             <motion.div 
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.3 }}
//               className="flex items-center space-x-4"
//             >
//               {/* Add any additional header items here */}
//             </motion.div>
//           </div>
//         </motion.div>
//         <main className="py-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout; 
// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import Sidebar from '../components/Sidebar';
// import Header from '../components/Header';

// const AdminLayout = () => {
//   return (
//     <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
//       <Sidebar />
//       <div className="flex flex-col flex-1">
//         <Header />
//         <main className="flex-1 overflow-auto p-4">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout; 
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import {
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  Cog8ToothIcon
} from '@heroicons/react/24/outline';

const adminNavItems = [
  {
    path: '/admin/dashboard',
    name: 'Dashboard',
    icon: <HomeIcon className="w-5 h-5" />
  },
  {
    path: '/admin/users',
    name: 'User Management',
    icon: <UsersIcon className="w-5 h-5" />
  },
  {
    path: '/admin/companies',
    name: 'Company Management',
    icon: <BuildingOfficeIcon className="w-5 h-5" />
  },
  {
    path: '/admin/communication-methods',
    name: 'Communication Methods',
    icon: <Cog8ToothIcon className="w-5 h-5" />
  }
];

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar navItems={adminNavItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 