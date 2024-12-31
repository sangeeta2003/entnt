// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { format, isValid, parseISO } from 'date-fns';
// import { BellIcon, CalendarIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
// import { userDashboardService } from '../../services/userDashboardService';
// import LoadingSpinner from '../../components/common/LoadingSpinner';

// const Dashboard = () => {
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [highlightSettings, setHighlightSettings] = useState({});
//   const [selectedCompany, setSelectedCompany] = useState(null);

//   // Helper function to safely format dates
//   const formatDate = (dateString) => {
//     if (!dateString) return 'No date';
//     try {
//       const date = parseISO(dateString);
//       return isValid(date) ? format(date, 'MMM d, yyyy') : 'Invalid date';
//     } catch (error) {
//       console.error('Error formatting date:', error);
//       return 'Invalid date';
//     }
//   };

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     show: { 
//       opacity: 1, 
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 100
//       }
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const data = await userDashboardService.getDashboardData();
      
//       // Process dates before setting state
//       const processedCompanies = data.companies?.map(company => ({
//         ...company,
//         communications: company.communications?.map(comm => ({
//           ...comm,
//           date: comm.date ? formatDate(comm.date) : 'No date'
//         })),
//         nextCommunication: company.nextCommunication ? {
//           ...company.nextCommunication,
//           scheduledDate: company.nextCommunication.scheduledDate ? 
//             formatDate(company.nextCommunication.scheduledDate) : 'No date'
//         } : null
//       })) || [];

//       setCompanies(processedCompanies);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       setError('Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getHighlightColor = (company) => {
//     if (highlightSettings[company._id]?.disableHighlights) {
//       return 'bg-white dark:bg-gray-800';
//     }

//     if (company.status === 'overdue') {
//       return 'bg-red-50 dark:bg-red-900/20 border-red-200 shadow-red-100/50';
//     }
//     if (company.status === 'due') {
//       return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 shadow-yellow-100/50';
//     }
//     return 'bg-white dark:bg-gray-800';
//   };

//   const toggleHighlights = (companyId) => {
//     setHighlightSettings(prev => ({
//       ...prev,
//       [companyId]: {
//         ...prev[companyId],
//         disableHighlights: !prev[companyId]?.disableHighlights
//       }
//     }));
//   };

//   if (loading) return (
//     <div className="flex items-center justify-center min-h-screen">
//       <LoadingSpinner />
//     </div>
//   );

//   if (error) return (
//     <motion.div 
//       initial={{ opacity: 0 }} 
//       animate={{ opacity: 1 }}
//       className="text-red-500 text-center p-4 bg-red-50 rounded-lg m-4"
//     >
//       {error}
//     </motion.div>
//   );

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <motion.div 
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="mb-8"
//       >
//         <div className="flex justify-between items-center mb-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//               Company Dashboard
//             </h1>
//             <p className="text-gray-600 dark:text-gray-400 mt-2">
//               Manage your company communications and schedules
//             </p>
//           </div>
//           <div className="flex space-x-4">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
//                        transition-colors duration-200"
//               onClick={fetchDashboardData}
//             >
//               Refresh Data
//             </motion.button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <motion.div 
//             whileHover={{ scale: 1.02 }}
//             className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-xl text-white"
//           >
//             <h3 className="text-lg font-semibold mb-2">Total Companies</h3>
//             <p className="text-3xl font-bold">{companies.length}</p>
//           </motion.div>
//           {/* Add more stat cards here */}
//         </div>
//       </motion.div>

//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="show"
//         className="grid gap-6"
//       >
//         <AnimatePresence>
//           {companies.map((company) => (
//             <motion.div
//               key={company._id}
//               variants={itemVariants}
//               layoutId={company._id}
//               onClick={() => setSelectedCompany(company._id)}
//               className={`relative p-6 rounded-xl border ${getHighlightColor(company)} 
//                          transition-all duration-300 hover:shadow-xl cursor-pointer
//                          transform hover:-translate-y-1`}
//             >
//               {/* Company Header */}
//               <div className="flex justify-between items-start mb-6">
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
//                     {company.name}
//                   </h2>
//                   <p className="text-sm text-gray-500 flex items-center">
//                     <CalendarIcon className="w-4 h-4 mr-1" />
//                     {company.location}
//                   </p>
//                 </div>
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleHighlights(company._id);
//                   }}
//                   className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700
//                            hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//                 >
//                   {highlightSettings[company._id]?.disableHighlights ? 'Enable' : 'Disable'} Highlights
//                 </motion.button>
//               </div>

//               {/* Communications Grid */}
//               <div className="grid md:grid-cols-2 gap-6">
//                 {/* Last Five Communications */}
//                 <div className="space-y-3">
//                   <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
//                     <ChatBubbleLeftIcon className="w-4 h-4 mr-2" />
//                     Last Five Communications
//                   </h3>
//                   <div className="space-y-2">
//                     {company.communications?.slice(0, 5).map((comm) => (
//                       <motion.div
//                         key={comm._id}
//                         className="relative group"
//                         whileHover={{ x: 5 }}
//                       >
//                         <div className="flex justify-between items-center text-sm p-2 rounded
//                                       bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 
//                                       dark:hover:bg-gray-600/50 transition-colors">
//                           <div className="flex items-center space-x-3">
//                             <span className="text-gray-600 dark:text-gray-400">
//                               {comm.type}
//                             </span>
//                           </div>
//                           <span className="text-gray-500">
//                             {comm.date}
//                           </span>
//                         </div>
//                         {comm.notes && (
//                           <motion.div
//                             initial={{ opacity: 0, scale: 0.95 }}
//                             whileHover={{ opacity: 1, scale: 1 }}
//                             className="absolute left-0 top-full mt-2 p-3 bg-white dark:bg-gray-800 
//                                      rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 
//                                      z-10 w-64 transform origin-top"
//                           >
//                             <p className="text-sm text-gray-600 dark:text-gray-400">
//                               {comm.notes}
//                             </p>
//                           </motion.div>
//                         )}
//                       </motion.div>
//                     ))}
//                     {(!company.communications || company.communications.length === 0) && (
//                       <p className="text-sm text-gray-500 italic">No recent communications</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Next Scheduled Communication */}
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-3">
//                     <BellIcon className="w-4 h-4 mr-2" />
//                     Next Scheduled Communication
//                   </h3>
//                   {company.nextCommunication ? (
//                     <motion.div
//                       whileHover={{ scale: 1.02 }}
//                       className="text-sm text-gray-600 dark:text-gray-400 p-3 rounded-lg
//                                 bg-gradient-to-r from-gray-50 to-gray-100 
//                                 dark:from-gray-700/50 dark:to-gray-600/50 shadow-sm"
//                     >
//                       <div className="flex justify-between items-center">
//                         <span className="font-medium">{company.nextCommunication.type}</span>
//                         <span>{company.nextCommunication.scheduledDate}</span>
//                       </div>
//                     </motion.div>
//                   ) : (
//                     <p className="text-sm text-gray-500 italic">
//                       No upcoming communications scheduled
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </motion.div>
//     </div>
//   );
// };

// export default Dashboard; 



// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { format, parseISO, isValid } from 'date-fns';
// import { BellIcon, CalendarIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
// import { userDashboardService } from '../../services/userDashboardService';
// import LoadingSpinner from '../../components/common/LoadingSpinner';

// const Dashboard = () => {
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Helper function to safely format dates
//   const formatDate = (dateString) => {
//     if (!dateString) return 'No date';
//     try {
//       const date = parseISO(dateString);
//       return isValid(date) ? format(date, 'MMM d, yyyy') : 'Invalid date';
//     } catch (error) {
//       console.error('Error formatting date:', error);
//       return 'Invalid date';
//     }
//   };

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const data = await userDashboardService.getDashboardData();
      
//       // Process the companies data to handle dates
//       const processedCompanies = data.companies?.map(company => ({
//         ...company,
//         communications: company.communications?.map(comm => ({
//           ...comm,
//           date: formatDate(comm.date)
//         })) || [],
//         nextCommunication: company.nextCommunication ? {
//           ...company.nextCommunication,
//           scheduledDate: formatDate(company.nextCommunication.scheduledDate)
//         } : null
//       })) || [];

//       setCompanies(processedCompanies);
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       setError('Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//     // Refresh data every 5 minutes
//     const interval = setInterval(fetchDashboardData, 300000);
//     return () => clearInterval(interval);
//   }, []);

//   if (loading) return <LoadingSpinner />;

//   if (error) {
//     return (
//       <div className="p-6 text-red-500 text-center">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
//       >
//         <AnimatePresence>
//           {companies.map((company) => (
//             <motion.div
//               key={company._id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
//             >
//               {/* Company card content */}
//               <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
//                 {company.name}
//               </h3>
              
//               {/* Recent Communications */}
//               {company.communications?.length > 0 && (
//                 <div className="mb-4">
//                   <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Recent Communications
//                   </h4>
//                   {company.communications.map((comm) => (
//                     <div key={comm._id} className="text-sm text-gray-600 dark:text-gray-400">
//                       {comm.type} - {comm.date}
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Next Communication */}
//               {company.nextCommunication && (
//                 <div className="mt-4">
//                   <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Next Communication
//                   </h4>
//                   <div className="text-sm text-gray-600 dark:text-gray-400">
//                     {company.nextCommunication.type} - {company.nextCommunication.scheduledDate}
//                   </div>
//                 </div>
//               )}
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </motion.div>
//     </div>
//   );
// };

// export default Dashboard; 

// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { format, parseISO, isValid } from 'date-fns';
// import { BellIcon, CalendarIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
// import { userDashboardService } from '../../services/userDashboardService';
// import LoadingSpinner from '../../components/common/LoadingSpinner';

// const Dashboard = () => {
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Helper function to safely format dates
//   const formatDate = (dateString) => {
//     if (!dateString) return 'No date';
//     try {
//       const date = parseISO(dateString);
//       return isValid(date) ? format(date, 'MMM d, yyyy') : 'Invalid date';
//     } catch (error) {
//       console.error('Error formatting date:', error);
//       return 'Invalid date';
//     }
//   };

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const data = await userDashboardService.getDashboardData();
      
//       // Process the companies data to handle dates
//       const processedCompanies = data.companies?.map(company => ({
//         ...company,
//         communications: company.communications?.map(comm => ({
//           ...comm,
//           date: formatDate(comm.date)
//         })) || [],
//         nextCommunication: company.nextCommunication ? {
//           ...company.nextCommunication,
//           scheduledDate: formatDate(company.nextCommunication.scheduledDate)
//         } : null
//       })) || [];

//       setCompanies(processedCompanies);
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       setError('Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//     // Refresh data every 5 minutes
//     const interval = setInterval(fetchDashboardData, 300000);
//     return () => clearInterval(interval);
//   }, []);

//   if (loading) return <LoadingSpinner />;

//   if (error) {
//     return (
//       <div className="p-6 text-red-500 text-center">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
//       >
//         <AnimatePresence>
//           {companies.map((company) => (
//             <motion.div
//               key={company._id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
//             >
//               <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
//                 {company.name}
//               </h3>
              
//               {/* Recent Communications */}
//               {company.communications?.length > 0 && (
//                 <div className="mb-4">
//                   <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
//                     <ChatBubbleLeftIcon className="w-4 h-4 mr-2" />
//                     Recent Communications
//                   </h4>
//                   <div className="space-y-2">
//                     {company.communications.map((comm) => (
//                       <div 
//                         key={comm._id} 
//                         className="text-sm text-gray-600 dark:text-gray-400 p-2 bg-gray-50 dark:bg-gray-700/50 rounded"
//                       >
//                         <div className="flex justify-between items-center">
//                           <span className="font-medium">{comm.type}</span>
//                           <span className="text-xs text-gray-500">{comm.date}</span>
//                         </div>
//                         {comm.notes && (
//                           <p className="mt-1 text-xs text-gray-500">{comm.notes}</p>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Next Communication */}
//               {company.nextCommunication && (
//                 <div className="mt-4">
//                   <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
//                     <BellIcon className="w-4 h-4 mr-2" />
//                     Next Communication
//                   </h4>
//                   <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
//                     <div className="flex justify-between items-center text-sm">
//                       <span className="font-medium text-blue-600 dark:text-blue-400">
//                         {company.nextCommunication.type}
//                       </span>
//                       <span className="text-xs text-blue-500">
//                         {company.nextCommunication.scheduledDate}
//                       </span>
//                     </div>
//                     {company.nextCommunication.notes && (
//                       <p className="mt-1 text-xs text-blue-500">
//                         {company.nextCommunication.notes}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </motion.div>
//     </div>
//   );
// };

// export default Dashboard; 



// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { format, parseISO, isValid } from 'date-fns';
// import { BellIcon, CalendarIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
// import { userDashboardService } from '../../services/userDashboardService';
// import LoadingSpinner from '../../components/common/LoadingSpinner';

// const Dashboard = () => {
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [highlightSettings, setHighlightSettings] = useState({});
//   const [selectedCompany, setSelectedCompany] = useState(null);

//   // Helper function to safely format dates
//   const formatDate = (dateString) => {
//     if (!dateString) return 'No date';
//     try {
//       // Handle both string dates and Date objects
//       const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
//       if (!isValid(date)) return 'Invalid date';
//       return format(date, 'MMM d, yyyy');
//     } catch (error) {
//       console.error('Error formatting date:', error, dateString);
//       return 'Invalid date';
//     }
//   };

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     show: { 
//       opacity: 1, 
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 100
//       }
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const data = await userDashboardService.getDashboardData();
      
//       // Process dates before setting state
//       const processedCompanies = data.companies?.map(company => ({
//         ...company,
//         communications: company.communications?.map(comm => ({
//           ...comm,
//           // Keep the original date and add formatted date
//           originalDate: comm.date,
//           date: formatDate(comm.date)
//         })) || [],
//         nextCommunication: company.nextCommunication ? {
//           ...company.nextCommunication,
//           // Keep the original date and add formatted date
//           originalDate: company.nextCommunication.scheduledDate,
//           scheduledDate: formatDate(company.nextCommunication.scheduledDate)
//         } : null
//       })) || [];

//       console.log('Processed companies:', processedCompanies); // Debug log
//       setCompanies(processedCompanies);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       setError('Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getHighlightColor = (company) => {
//     if (highlightSettings[company._id]?.disableHighlights) {
//       return 'bg-white dark:bg-gray-800';
//     }

//     if (company.status === 'overdue') {
//       return 'bg-red-50 dark:bg-red-900/20 border-red-200 shadow-red-100/50';
//     }
//     if (company.status === 'due') {
//       return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 shadow-yellow-100/50';
//     }
//     return 'bg-white dark:bg-gray-800';
//   };

//   const toggleHighlights = (companyId) => {
//     setHighlightSettings(prev => ({
//       ...prev,
//       [companyId]: {
//         ...prev[companyId],
//         disableHighlights: !prev[companyId]?.disableHighlights
//       }
//     }));
//   };

//   if (loading) return (
//     <div className="flex items-center justify-center min-h-screen">
//       <LoadingSpinner />
//     </div>
//   );

//   if (error) return (
//     <motion.div 
//       initial={{ opacity: 0 }} 
//       animate={{ opacity: 1 }}
//       className="text-red-500 text-center p-4 bg-red-50 rounded-lg m-4"
//     >
//       {error}
//     </motion.div>
//   );

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <motion.div 
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="mb-8"
//       >
//         <div className="flex justify-between items-center mb-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//               Company Dashboard
//             </h1>
//             <p className="text-gray-600 dark:text-gray-400 mt-2">
//               Manage your company communications and schedules
//             </p>
//           </div>
//           <div className="flex space-x-4">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
//                        transition-colors duration-200"
//               onClick={fetchDashboardData}
//             >
//               Refresh Data
//             </motion.button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <motion.div 
//             whileHover={{ scale: 1.02 }}
//             className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-xl text-white"
//           >
//             <h3 className="text-lg font-semibold mb-2">Total Companies</h3>
//             <p className="text-3xl font-bold">{companies.length}</p>
//           </motion.div>
//           {/* Add more stat cards here */}
//         </div>
//       </motion.div>

//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="show"
//         className="grid gap-6"
//       >
//         <AnimatePresence>
//           {companies.map((company) => (
//             <motion.div
//               key={company._id}
//               variants={itemVariants}
//               layoutId={company._id}
//               onClick={() => setSelectedCompany(company._id)}
//               className={`relative p-6 rounded-xl border ${getHighlightColor(company)} 
//                          transition-all duration-300 hover:shadow-xl cursor-pointer
//                          transform hover:-translate-y-1`}
//             >
//               {/* Company Header */}
//               <div className="flex justify-between items-start mb-6">
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
//                     {company.name}
//                   </h2>
//                   <p className="text-sm text-gray-500 flex items-center">
//                     <CalendarIcon className="w-4 h-4 mr-1" />
//                     {company.location}
//                   </p>
//                 </div>
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleHighlights(company._id);
//                   }}
//                   className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700
//                            hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//                 >
//                   {highlightSettings[company._id]?.disableHighlights ? 'Enable' : 'Disable'} Highlights
//                 </motion.button>
//               </div>

//               {/* Communications Grid */}
//               <div className="grid md:grid-cols-2 gap-6">
//                 {/* Last Five Communications */}
//                 <div className="space-y-3">
//                   <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
//                     <ChatBubbleLeftIcon className="w-4 h-4 mr-2" />
//                     Last Five Communications
//                   </h3>
//                   <div className="space-y-2">
//                     {company.communications?.slice(0, 5).map((comm) => (
//                       <motion.div
//                         key={comm._id}
//                         className="relative group"
//                         whileHover={{ x: 5 }}
//                       >
//                         <div className="flex justify-between items-center text-sm p-2 rounded
//                                       bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 
//                                       dark:hover:bg-gray-600/50 transition-colors">
//                           <div className="flex items-center space-x-3">
//                             <span className="text-gray-600 dark:text-gray-400">
//                               {comm.type}
//                             </span>
//                           </div>
//                           <span className="text-gray-500">
//                             {comm.date}
//                           </span>
//                         </div>
//                         {comm.notes && (
//                           <motion.div
//                             initial={{ opacity: 0, scale: 0.95 }}
//                             whileHover={{ opacity: 1, scale: 1 }}
//                             className="absolute left-0 top-full mt-2 p-3 bg-white dark:bg-gray-800 
//                                      rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 
//                                      z-10 w-64 transform origin-top"
//                           >
//                             <p className="text-sm text-gray-600 dark:text-gray-400">
//                               {comm.notes}
//                             </p>
//                           </motion.div>
//                         )}
//                       </motion.div>
//                     ))}
//                     {(!company.communications || company.communications.length === 0) && (
//                       <p className="text-sm text-gray-500 italic">No recent communications</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Next Scheduled Communication */}
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-3">
//                     <BellIcon className="w-4 h-4 mr-2" />
//                     Next Scheduled Communication
//                   </h3>
//                   {company.nextCommunication ? (
//                     <motion.div
//                       whileHover={{ scale: 1.02 }}
//                       className="text-sm text-gray-600 dark:text-gray-400 p-3 rounded-lg
//                                 bg-gradient-to-r from-gray-50 to-gray-100 
//                                 dark:from-gray-700/50 dark:to-gray-600/50 shadow-sm"
//                     >
//                       <div className="flex justify-between items-center">
//                         <span className="font-medium">{company.nextCommunication.type}</span>
//                         <span>{company.nextCommunication.scheduledDate}</span>
//                       </div>
//                     </motion.div>
//                   ) : (
//                     <p className="text-sm text-gray-500 italic">
//                       No upcoming communications scheduled
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </motion.div>
//     </div>
//   );
// };

// export default Dashboard; 




// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { format, parseISO, isValid } from 'date-fns';
// import { BellIcon, CalendarIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
// import { userDashboardService } from '../../services/userDashboardService';
// import LoadingSpinner from '../../components/common/LoadingSpinner';

// const Dashboard = () => {
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [highlightSettings, setHighlightSettings] = useState({});
//   const [selectedCompany, setSelectedCompany] = useState(null);

//   // Updated formatDate function
//   const formatDate = (dateString) => {
//     if (!dateString) return 'No date';
//     try {
//       // First try parsing as ISO string
//       let date = parseISO(dateString);
      
//       // If that fails, try creating a new Date object
//       if (!isValid(date)) {
//         date = new Date(dateString);
//       }
      
//       // If we still don't have a valid date, return error message
//       if (!isValid(date)) {
//         console.error('Invalid date:', dateString);
//         return 'Invalid date';
//       }
      
//       return format(date, 'MMM d, yyyy');
//     } catch (error) {
//       console.error('Error formatting date:', error, dateString);
//       return 'Invalid date';
//     }
//   };

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     show: { 
//       opacity: 1, 
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 100
//       }
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const data = await userDashboardService.getDashboardData();
      
//       console.log('Raw data from API:', data); // Debug log

//       // Process dates before setting state
//       const processedCompanies = data.companies?.map(company => {
//         console.log('Processing company:', company.name); // Debug log
        
//         return {
//           ...company,
//           communications: company.communications?.map(comm => {
//             console.log('Processing communication date:', comm.date); // Debug log
//             return {
//               ...comm,
//               date: formatDate(comm.date)
//             };
//           }) || [],
//           nextCommunication: company.nextCommunication ? {
//             ...company.nextCommunication,
//             scheduledDate: formatDate(company.nextCommunication.scheduledDate)
//           } : null
//         };
//       }) || [];

//       console.log('Processed companies:', processedCompanies); // Debug log
//       setCompanies(processedCompanies);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       setError('Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getHighlightColor = (company) => {
//     if (highlightSettings[company._id]?.disableHighlights) {
//       return 'bg-white dark:bg-gray-800';
//     }

//     if (company.status === 'overdue') {
//       return 'bg-red-50 dark:bg-red-900/20 border-red-200 shadow-red-100/50';
//     }
//     if (company.status === 'due') {
//       return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 shadow-yellow-100/50';
//     }
//     return 'bg-white dark:bg-gray-800';
//   };

//   const toggleHighlights = (companyId) => {
//     setHighlightSettings(prev => ({
//       ...prev,
//       [companyId]: {
//         ...prev[companyId],
//         disableHighlights: !prev[companyId]?.disableHighlights
//       }
//     }));
//   };

//   if (loading) return (
//     <div className="flex items-center justify-center min-h-screen">
//       <LoadingSpinner />
//     </div>
//   );

//   if (error) return (
//     <motion.div 
//       initial={{ opacity: 0 }} 
//       animate={{ opacity: 1 }}
//       className="text-red-500 text-center p-4 bg-red-50 rounded-lg m-4"
//     >
//       {error}
//     </motion.div>
//   );

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <motion.div 
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="mb-8"
//       >
//         <div className="flex justify-between items-center mb-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//               Company Dashboard
//             </h1>
//             <p className="text-gray-600 dark:text-gray-400 mt-2">
//               Manage your company communications and schedules
//             </p>
//           </div>
//           <div className="flex space-x-4">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
//                        transition-colors duration-200"
//               onClick={fetchDashboardData}
//             >
//               Refresh Data
//             </motion.button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <motion.div 
//             whileHover={{ scale: 1.02 }}
//             className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-xl text-white"
//           >
//             <h3 className="text-lg font-semibold mb-2">Total Companies</h3>
//             <p className="text-3xl font-bold">{companies.length}</p>
//           </motion.div>
//           {/* Add more stat cards here */}
//         </div>
//       </motion.div>

//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="show"
//         className="grid gap-6"
//       >
//         <AnimatePresence>
//           {companies.map((company) => (
//             <motion.div
//               key={company._id}
//               variants={itemVariants}
//               layoutId={company._id}
//               onClick={() => setSelectedCompany(company._id)}
//               className={`relative p-6 rounded-xl border ${getHighlightColor(company)} 
//                          transition-all duration-300 hover:shadow-xl cursor-pointer
//                          transform hover:-translate-y-1`}
//             >
//               {/* Company Header */}
//               <div className="flex justify-between items-start mb-6">
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
//                     {company.name}
//                   </h2>
//                   <p className="text-sm text-gray-500 flex items-center">
//                     <CalendarIcon className="w-4 h-4 mr-1" />
//                     {company.location}
//                   </p>
//                 </div>
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleHighlights(company._id);
//                   }}
//                   className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700
//                            hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//                 >
//                   {highlightSettings[company._id]?.disableHighlights ? 'Enable' : 'Disable'} Highlights
//                 </motion.button>
//               </div>

//               {/* Communications Grid */}
//               <div className="grid md:grid-cols-2 gap-6">
//                 {/* Last Five Communications */}
//                 <div className="space-y-3">
//                   <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
//                     <ChatBubbleLeftIcon className="w-4 h-4 mr-2" />
//                     Last Five Communications
//                   </h3>
//                   <div className="space-y-2">
//                     {company.communications?.slice(0, 5).map((comm) => (
//                       <motion.div
//                         key={comm._id}
//                         className="relative group"
//                         whileHover={{ x: 5 }}
//                       >
//                         <div className="flex justify-between items-center text-sm p-2 rounded
//                                       bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 
//                                       dark:hover:bg-gray-600/50 transition-colors">
//                           <div className="flex items-center space-x-3">
//                             <span className="text-gray-600 dark:text-gray-400">
//                               {comm.type}
//                             </span>
//                           </div>
//                           <span className="text-gray-500">
//                             {comm.date}
//                           </span>
//                         </div>
//                         {comm.notes && (
//                           <motion.div
//                             initial={{ opacity: 0, scale: 0.95 }}
//                             whileHover={{ opacity: 1, scale: 1 }}
//                             className="absolute left-0 top-full mt-2 p-3 bg-white dark:bg-gray-800 
//                                      rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 
//                                      z-10 w-64 transform origin-top"
//                           >
//                             <p className="text-sm text-gray-600 dark:text-gray-400">
//                               {comm.notes}
//                             </p>
//                           </motion.div>
//                         )}
//                       </motion.div>
//                     ))}
//                     {(!company.communications || company.communications.length === 0) && (
//                       <p className="text-sm text-gray-500 italic">No recent communications</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Next Scheduled Communication */}
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-3">
//                     <BellIcon className="w-4 h-4 mr-2" />
//                     Next Scheduled Communication
//                   </h3>
//                   {company.nextCommunication ? (
//                     <motion.div
//                       whileHover={{ scale: 1.02 }}
//                       className="text-sm text-gray-600 dark:text-gray-400 p-3 rounded-lg
//                                 bg-gradient-to-r from-gray-50 to-gray-100 
//                                 dark:from-gray-700/50 dark:to-gray-600/50 shadow-sm"
//                     >
//                       <div className="flex justify-between items-center">
//                         <span className="font-medium">{company.nextCommunication.type}</span>
//                         <span>{company.nextCommunication.scheduledDate}</span>
//                       </div>
//                     </motion.div>
//                   ) : (
//                     <p className="text-sm text-gray-500 italic">
//                       No upcoming communications scheduled
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </motion.div>
//     </div>
//   );
// };

// export default Dashboard; 



import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, isValid } from 'date-fns';
import { BellIcon, CalendarIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { userDashboardService } from '../../services/userDashboardService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Dashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightSettings, setHighlightSettings] = useState({});
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Updated formatDate function with better handling of date formats
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      // First try parsing as ISO string
      let date = parseISO(dateString);
      
      // If that fails, try creating a new Date object
      if (!isValid(date)) {
        date = new Date(dateString);
      }
      
      // If we still don't have a valid date, try extracting from string
      if (!isValid(date) && typeof dateString === 'string') {
        // Try to extract date from string that might contain time
        const dateMatch = dateString.match(/^\d{4}-\d{2}-\d{2}/);
        if (dateMatch) {
          date = parseISO(dateMatch[0]);
        }
      }
      
      // Final check if we have a valid date
      if (!isValid(date)) {
        console.warn('Invalid date:', dateString);
        return 'No date';
      }
      
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'No date';
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await userDashboardService.getDashboardData();
      
      console.log('Raw data from API:', data); // Debug log

      // Process dates before setting state
      const processedCompanies = data.companies?.map(company => {
        console.log('Processing company:', company.name); // Debug log
        
        return {
          ...company,
          communications: company.communications?.map(comm => {
            console.log('Processing communication:', comm); // More detailed logging
            return {
              ...comm,
              date: formatDate(comm.date || comm.scheduledDate || comm.createdAt)
            };
          }) || [],
          nextCommunication: company.nextCommunication ? {
            ...company.nextCommunication,
            scheduledDate: formatDate(
              company.nextCommunication.scheduledDate || 
              company.nextCommunication.date || 
              company.nextCommunication.createdAt
            )
          } : null
        };
      }) || [];

      console.log('Processed companies:', processedCompanies); // Debug log
      setCompanies(processedCompanies);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getHighlightColor = (company) => {
    if (highlightSettings[company._id]?.disableHighlights) {
      return 'bg-white dark:bg-gray-800';
    }

    if (company.status === 'overdue') {
      return 'bg-red-50 dark:bg-red-900/20 border-red-200 shadow-red-100/50';
    }
    if (company.status === 'due') {
      return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 shadow-yellow-100/50';
    }
    return 'bg-white dark:bg-gray-800';
  };

  const toggleHighlights = (companyId) => {
    setHighlightSettings(prev => ({
      ...prev,
      [companyId]: {
        ...prev[companyId],
        disableHighlights: !prev[companyId]?.disableHighlights
      }
    }));
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner />
    </div>
  );

  if (error) return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="text-red-500 text-center p-4 bg-red-50 rounded-lg m-4"
    >
      {error}
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Company Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your company communications and schedules
            </p>
          </div>
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
                       transition-colors duration-200"
              onClick={fetchDashboardData}
            >
              Refresh Data
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-xl text-white"
          >
            <h3 className="text-lg font-semibold mb-2">Total Companies</h3>
            <p className="text-3xl font-bold">{companies.length}</p>
          </motion.div>
          {/* Add more stat cards here */}
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6"
      >
        <AnimatePresence>
          {companies.map((company) => (
            <motion.div
              key={company._id}
              variants={itemVariants}
              layoutId={company._id}
              onClick={() => setSelectedCompany(company._id)}
              className={`relative p-6 rounded-xl border ${getHighlightColor(company)} 
                         transition-all duration-300 hover:shadow-xl cursor-pointer
                         transform hover:-translate-y-1`}
            >
              {/* Company Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {company.name}
                  </h2>
                  <p className="text-sm text-gray-500 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {company.location}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleHighlights(company._id);
                  }}
                  className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700
                           hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {highlightSettings[company._id]?.disableHighlights ? 'Enable' : 'Disable'} Highlights
                </motion.button>
              </div>

              {/* Communications Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Last Five Communications */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <ChatBubbleLeftIcon className="w-4 h-4 mr-2" />
                    Last Five Communications
                  </h3>
                  <div className="space-y-2">
                    {company.communications?.slice(0, 5).map((comm) => (
                      <motion.div
                        key={comm._id}
                        className="relative group"
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex justify-between items-center text-sm p-2 rounded
                                      bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 
                                      dark:hover:bg-gray-600/50 transition-colors">
                          <div className="flex items-center space-x-3">
                            <span className="text-gray-600 dark:text-gray-400">
                              {comm.type}
                            </span>
                          </div>
                          <span className="text-gray-500">
                            {comm.date}
                          </span>
                        </div>
                        {comm.notes && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileHover={{ opacity: 1, scale: 1 }}
                            className="absolute left-0 top-full mt-2 p-3 bg-white dark:bg-gray-800 
                                     rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 
                                     z-10 w-64 transform origin-top"
                          >
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {comm.notes}
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                    {(!company.communications || company.communications.length === 0) && (
                      <p className="text-sm text-gray-500 italic">No recent communications</p>
                    )}
                  </div>
                </div>

                {/* Next Scheduled Communication */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-3">
                    <BellIcon className="w-4 h-4 mr-2" />
                    Next Scheduled Communication
                  </h3>
                  {company.nextCommunication ? (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="text-sm text-gray-600 dark:text-gray-400 p-3 rounded-lg
                                bg-gradient-to-r from-gray-50 to-gray-100 
                                dark:from-gray-700/50 dark:to-gray-600/50 shadow-sm"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{company.nextCommunication.type}</span>
                        <span>{company.nextCommunication.scheduledDate}</span>
                      </div>
                    </motion.div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No upcoming communications scheduled
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Dashboard; 

