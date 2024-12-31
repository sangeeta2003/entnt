import React from 'react';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { 
  VideoCameraIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  CalendarIcon 
} from '@heroicons/react/24/outline';

const CalendarView = ({ communications, onEventClick, onDateSelect }) => {
  const getEventColor = (type) => {
    switch (type) {
      case 'video': return '#3B82F6'; // blue
      case 'call': return '#10B981';  // green
      case 'email': return '#F59E0B'; // yellow
      case 'meeting': return '#6366F1'; // indigo
      default: return '#6B7280';      // gray
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'video': return VideoCameraIcon;
      case 'call': return PhoneIcon;
      case 'email': return EnvelopeIcon;
      case 'meeting': return CalendarIcon;
      default: return CalendarIcon;
    }
  };

  const events = communications.map(comm => {
    const Icon = getEventIcon(comm.type);
    return {
      id: comm.id,
      title: comm.subject,
      start: `${comm.date}T${comm.time}`,
      backgroundColor: getEventColor(comm.type),
      extendedProps: {
        company: comm.company,
        type: comm.type,
        icon: Icon
      }
    };
  });

  const renderEventContent = (eventInfo) => {
    const Icon = eventInfo.event.extendedProps.icon;
    return (
      <div className="flex items-center space-x-2 p-1">
        <Icon className="h-4 w-4" />
        <div>
          <div className="font-medium text-sm">{eventInfo.event.title}</div>
          <div className="text-xs opacity-75">{eventInfo.event.extendedProps.company}</div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        eventContent={renderEventContent}
        eventClick={onEventClick}
        selectable={true}
        select={onDateSelect}
        height="auto"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false
        }}
      />
    </motion.div>
  );
};

export default CalendarView; 