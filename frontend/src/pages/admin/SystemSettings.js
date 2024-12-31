import React from 'react';
import { motion } from 'framer-motion';

const SystemSettings = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        System Settings
      </h1>
      {/* Add system settings content here */}
    </motion.div>
  );
};

export default SystemSettings; 