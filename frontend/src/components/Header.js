import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu } from '@headlessui/react';
import { 
  UserCircleIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - can add breadcrumbs or other navigation here */}
          <div className="flex items-center">
            
          </div>

          {/* Right side - user menu */}
          <div className="flex items-center">
            <Menu as="div" className="relative ml-3">
              <Menu.Button className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="sr-only">Open user menu</span>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700 dark:text-gray-300">
                    {user?.name || user?.email}
                  </span>
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                </div>
              </Menu.Button>

              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-600 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#profile"
                        className={`${
                          active ? 'bg-gray-100 dark:bg-gray-600' : ''
                        } flex px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                      >
                        <UserCircleIcon className="mr-3 h-5 w-5" />
                        Your Profile
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#settings"
                        className={`${
                          active ? 'bg-gray-100 dark:bg-gray-600' : ''
                        } flex px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                      >
                        <Cog6ToothIcon className="mr-3 h-5 w-5" />
                        Settings
                      </a>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={`${
                          active ? 'bg-gray-100 dark:bg-gray-600' : ''
                        } flex w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                      >
                        <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 