import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ChartBarIcon,
  UsersIcon,
  BuildingOfficeIcon,
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import Logo from './Logo';

const navigation = [
  {
    name: 'Dashboard',
    icon: HomeIcon,
    href: '/admin/dashboard',
    description: 'Overview and statistics'
  },
  {
    name: 'Users',
    icon: UsersIcon,
    href: '/admin/users',
    description: 'User management'
  },
  {
    name: 'Companies',
    icon: BuildingOfficeIcon,
    href: '/admin/companies',
    description: 'Manage companies'
  },
  {
    name: 'Communication Methods',
    icon: ChatBubbleLeftRightIcon,
    href: '/admin/communication-methods',
    description: 'Manage communication methods'
  },
  {
    name: 'Analytics',
    icon: ChartBarIcon,
    href: '/admin/analytics',
    description: 'View analytics'
  },
  {
    name: 'Security',
    icon: ShieldCheckIcon,
    href: '/admin/security',
    description: 'Security settings'
  },
  {
    name: 'Settings',
    icon: Cog6ToothIcon,
    children: [
      {
        name: 'System',
        href: '/admin/settings/system',
        description: 'System settings'
      },
      {
        name: 'Notifications',
        href: '/admin/notifications',
        description: 'Notification settings'
      }
    ]
  },
  {
    name: 'Audit Logs',
    icon: ClipboardDocumentListIcon,
    href: '/admin/audit-logs',
    description: 'View system logs'
  }
];

const AdminSidebar = () => {
  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-grow flex-col overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="flex-shrink-0 px-4 py-5">
          <Logo />
        </div>
        <nav className="mt-5 flex-1 space-y-1 px-2">
          {navigation.map((item) => !item.children ? (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => `
                group flex items-center px-2 py-2 text-sm font-medium rounded-md
                ${isActive
                  ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
            >
              <item.icon
                className="mr-3 h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ) : (
            <div key={item.name} className="space-y-1">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 pt-4">
                {item.name}
              </div>
              {item.children.map((subItem) => (
                <NavLink
                  key={subItem.name}
                  to={subItem.href}
                  className={({ isActive }) => `
                    group flex items-center pl-7 px-2 py-2 text-sm font-medium rounded-md
                    ${isActive
                      ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {subItem.name}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar; 