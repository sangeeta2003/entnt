import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from '@heroicons/react/24/outline';

const DateRangePicker = ({ startDate, endDate, onChange, className }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        <DatePicker
          selected={startDate}
          onChange={(date) => onChange({ start: date, end: endDate })}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholderText="Start Date"
          dateFormat="MMM d, yyyy"
        />
        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
      
      <div className="relative flex-1">
        <DatePicker
          selected={endDate}
          onChange={(date) => onChange({ start: startDate, end: date })}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholderText="End Date"
          dateFormat="MMM d, yyyy"
        />
        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
};

export default DateRangePicker; 