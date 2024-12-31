// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import {
//   format,
//   startOfMonth,
//   endOfMonth,
//   eachDayOfInterval,
//   isSameMonth,
//   isToday,
//   addMonths,
//   subMonths
// } from 'date-fns';
// import {
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   CalendarIcon
// } from '@heroicons/react/24/outline';
// import { userDashboardService } from '../../services/userDashboardService';

// const Calendar = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchCalendarData();
//   }, [currentDate]);

//   const fetchCalendarData = async () => {
//     try {
//       setLoading(true);
//       const month = currentDate.getMonth() + 1;
//       const year = currentDate.getFullYear();
//       const data = await userDashboardService.getCalendarView(month, year);
//       setEvents(data);
//     } catch (error) {
//       console.error('Error fetching calendar data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getDaysInMonth = () => {
//     const start = startOfMonth(currentDate);
//     const end = endOfMonth(currentDate);
//     return eachDayOfInterval({ start, end });
//   };

//   const days = getDaysInMonth();

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//           className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
//         />
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="container mx-auto px-4 py-6"
//     >
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
//         {/* Calendar Header */}
//         <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
//           <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//             {format(currentDate, 'MMMM yyyy')}
//           </h2>
//           <div className="flex space-x-2">
//             <button
//               onClick={() => setCurrentDate(prev => subMonths(prev, 1))}
//               className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
//             >
//               <ChevronLeftIcon className="h-5 w-5" />
//             </button>
//             <button
//               onClick={() => setCurrentDate(prev => addMonths(prev, 1))}
//               className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
//             >
//               <ChevronRightIcon className="h-5 w-5" />
//             </button>
//           </div>
//         </div>

//         {/* Calendar Grid */}
//         <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
//           {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//             <div
//               key={day}
//               className="bg-gray-50 dark:bg-gray-800 p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
//             >
//               {day}
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
//           {days.map(day => {
//             const isCurrentMonth = isSameMonth(day, currentDate);
//             const isCurrentDay = isToday(day);
//             const dayEvents = events.filter(event => 
//               format(new Date(event.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
//             );

//             return (
//               <motion.div
//                 key={day.toString()}
//                 className={`min-h-[120px] bg-white dark:bg-gray-800 p-2 cursor-pointer
//                   ${!isCurrentMonth ? 'opacity-50' : ''}
//                   ${isCurrentDay ? 'ring-2 ring-blue-500' : ''}
//                 `}
//               >
//                 <div className={`text-sm ${
//                   isCurrentDay 
//                     ? 'text-blue-600 dark:text-blue-400 font-bold'
//                     : 'text-gray-500 dark:text-gray-400'
//                 }`}>
//                   {format(day, 'd')}
//                 </div>
//                 <div className="mt-1 space-y-1">
//                   {dayEvents.map((event) => (
//                     <motion.div
//                       key={event._id}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       className="text-xs p-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
//                     >
//                       {event.type} - {event.company.name}
//                     </motion.div>
//                   ))}
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       </div>
//     </motion.div>
//   );
// };

//  export default Calendar; 
// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import {
//   format,
//   startOfMonth,
//   endOfMonth,
//   eachDayOfInterval,
//   isSameMonth,
//   isToday,
//   addMonths,
//   subMonths,
//   parseISO,
//   isValid
// } from 'date-fns';
// import {
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   CalendarIcon
// } from '@heroicons/react/24/outline';
// import { userDashboardService } from '../../services/userDashboardService';

// const Calendar = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Helper function to safely format dates
//   const formatDate = (dateString) => {
//     if (!dateString) return 'No date';
//     try {
//       const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
//       return isValid(date) ? format(date, 'MMM d, yyyy') : 'Invalid date';
//     } catch (error) {
//       console.error('Error formatting date:', error);
//       return 'Invalid date';
//     }
//   };

//   useEffect(() => {
//     fetchCalendarData();
//   }, [currentDate]);

//   const fetchCalendarData = async () => {
//     try {
//       const month = currentDate.getMonth() + 1;
//       const year = currentDate.getFullYear();
//       const data = await userDashboardService.getCalendarView(month, year);
      
//       // Process the events data to ensure valid dates
//       const processedEvents = data.map(event => ({
//         ...event,
//         date: event.date ? parseISO(event.date) : null,
//         company: {
//           ...event.company,
//           name: event.company?.name || 'Unknown Company'
//         }
//       })).filter(event => event.date && isValid(event.date));

//       setEvents(processedEvents);
//     } catch (error) {
//       console.error('Error fetching calendar data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const days = eachDayOfInterval({
//     start: startOfMonth(currentDate),
//     end: endOfMonth(currentDate)
//   });

//   const getDayEvents = (day) => {
//     return events.filter(event => 
//       event.date && 
//       format(event.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
//     );
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="p-6"
//     >
//       {/* Calendar Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
//           {format(currentDate, 'MMMM yyyy')}
//         </h1>
//         <div className="flex space-x-2">
//           <button
//             onClick={() => setCurrentDate(subMonths(currentDate, 1))}
//             className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
//           >
//             <ChevronLeftIcon className="w-5 h-5" />
//           </button>
//           <button
//             onClick={() => setCurrentDate(addMonths(currentDate, 1))}
//             className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
//           >
//             <ChevronRightIcon className="w-5 h-5" />
//           </button>
//         </div>
//       </div>

//       {/* Calendar Grid */}
//       <div className="grid grid-cols-7 gap-2">
//         {days.map((day) => {
//           const dayEvents = getDayEvents(day);
//           return (
//             <div
//               key={day.toString()}
//               className={`
//                 min-h-[100px] p-2 rounded-lg border
//                 ${!isSameMonth(day, currentDate) ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'}
//                 ${isToday(day) ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'}
//               `}
//             >
//               <div className="text-sm font-medium text-gray-900 dark:text-white">
//                 {format(day, 'd')}
//               </div>
//               <div className="mt-1 space-y-1">
//                 {dayEvents.map((event) => (
//                   <motion.div
//                     key={event._id}
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="text-xs p-1 rounded bg-blue-100 dark:bg-blue-900/20 
//                              text-blue-700 dark:text-blue-200"
//                   >
//                     {event.type} - {event.company.name}
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </motion.div>
//   );
// };

// export default Calendar; 



// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import {
//   format,
//   startOfMonth,
//   endOfMonth,
//   eachDayOfInterval,
//   isSameMonth,
//   isToday,
//   addMonths,
//   subMonths,
//   parseISO,
//   isValid,
//   isSameDay
// } from 'date-fns';
// import {
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   CalendarIcon
// } from '@heroicons/react/24/outline';
// import { userDashboardService } from '../../services/userDashboardService';

// const Calendar = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchCalendarData();
//   }, [currentDate]);

//   const fetchCalendarData = async () => {
//     try {
//       const month = currentDate.getMonth() + 1;
//       const year = currentDate.getFullYear();
//       const data = await userDashboardService.getCalendarView(month, year);
      
//       console.log('Raw calendar data:', data); // Debug log
      
//       // Process and validate dates
//       const processedEvents = data.map(event => {
//         try {
//           // Handle both scheduledDate and date fields
//           const dateString = event.scheduledDate || event.date;
//           const date = parseISO(dateString);
          
//           if (!isValid(date)) {
//             console.warn('Invalid date found:', dateString);
//             return null;
//           }
          
//           return {
//             ...event,
//             date,
//             company: {
//               ...event.company,
//               name: event.company?.name || 'Unknown Company'
//             }
//           };
//         } catch (error) {
//           console.error('Error processing event date:', error);
//           return null;
//         }
//       }).filter(Boolean);

//       console.log('Processed events:', processedEvents); // Debug log
//       setEvents(processedEvents);
//     } catch (error) {
//       console.error('Error fetching calendar data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const days = eachDayOfInterval({
//     start: startOfMonth(currentDate),
//     end: endOfMonth(currentDate)
//   });

//   const getDayEvents = (day) => {
//     return events.filter(event => 
//       event.date && isSameDay(event.date, day)
//     );
//   };

//   if (loading) {
//     return (
//       <div className="p-6 flex justify-center items-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="p-6"
//     >
//       {/* Calendar Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
//           {format(currentDate, 'MMMM yyyy')}
//         </h1>
//         <div className="flex space-x-2">
//           <button
//             onClick={() => setCurrentDate(subMonths(currentDate, 1))}
//             className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
//           >
//             <ChevronLeftIcon className="w-5 h-5" />
//           </button>
//           <button
//             onClick={() => setCurrentDate(addMonths(currentDate, 1))}
//             className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
//           >
//             <ChevronRightIcon className="w-5 h-5" />
//           </button>
//         </div>
//       </div>

//       {/* Calendar Grid */}
//       <div className="grid grid-cols-7 gap-2">
//         {days.map((day) => {
//           const dayEvents = getDayEvents(day);
//           return (
//             <div
//               key={day.toString()}
//               className={`
//                 min-h-[100px] p-2 rounded-lg border
//                 ${!isSameMonth(day, currentDate) ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'}
//                 ${isToday(day) ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'}
//               `}
//             >
//               <div className="text-sm font-medium text-gray-900 dark:text-white">
//                 {format(day, 'd')}
//               </div>
//               <div className="mt-1 space-y-1">
//                 {dayEvents.map((event) => (
//                   <motion.div
//                     key={event._id}
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="text-xs p-1 rounded bg-blue-100 dark:bg-blue-900/20 
//                              text-blue-700 dark:text-blue-200"
//                   >
//                     {event.type} - {event.company.name}
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </motion.div>
//   );
// };

// export default Calendar; 






import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  parseISO,
  isValid
} from 'date-fns';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { userDashboardService } from '../../services/userDashboardService';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendarData();
  }, [currentDate]);

  const fetchCalendarData = async () => {
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const data = await userDashboardService.getCalendarView(month, year);
      
      // Process the dates when receiving the data
      const processedEvents = data.map(event => {
        try {
          const dateStr = event.scheduledDate || event.date;
          if (!dateStr) return null;
          
          const parsedDate = parseISO(dateStr);
          if (!isValid(parsedDate)) return null;

          return {
            ...event,
            date: parsedDate // Store the parsed Date object
          };
        } catch (error) {
          console.error('Error processing event date:', error);
          return null;
        }
      }).filter(Boolean); // Remove null events

      setEvents(processedEvents);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  // Update the event filtering to use the processed dates
  const getDayEvents = (day) => {
    return events.filter(event => {
      try {
        return format(event.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
      } catch (error) {
        console.error('Error comparing dates:', error);
        return false;
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-6"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentDate(prev => subMonths(prev, 1))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentDate(prev => addMonths(prev, 1))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              className="bg-gray-50 dark:bg-gray-800 p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
          {days.map(day => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isCurrentDay = isToday(day);
            const dayEvents = getDayEvents(day);

            return (
              <motion.div
                key={day.toString()}
                className={`min-h-[120px] bg-white dark:bg-gray-800 p-2 cursor-pointer
                  ${!isCurrentMonth ? 'opacity-50' : ''}
                  ${isCurrentDay ? 'ring-2 ring-blue-500' : ''}
                `}
              >
                <div className={`text-sm ${
                  isCurrentDay 
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {format(day, 'd')}
                </div>
                <div className="mt-1 space-y-1">
                  {dayEvents.map((event) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs p-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                    >
                      {event.type} - {event.company.name}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Calendar; 