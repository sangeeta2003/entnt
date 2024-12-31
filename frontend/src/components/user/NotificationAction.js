import React from 'react';
import { motion } from 'framer-motion';

const NotificationAction = ({ notification, onComplete }) => {
  const handleClick = async () => {
    try {
      await onComplete(notification._id);
    } catch (error) {
      console.error('Error completing notification:', error);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                 transition-colors duration-200"
    >
      Mark Complete
    </motion.button>
  );
};

export default NotificationAction; 