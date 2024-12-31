export const sendNotifications = async (communication) => {
  // Ensure participants is an array
  const participantsList = Array.isArray(communication.participants)
    ? communication.participants
    : communication.participants?.split(',').map(p => p.trim()) || [];

  // Send email notifications
  const emailNotification = {
    to: participantsList,
    subject: `New ${communication.type}: ${communication.title}`,
    body: `
      You have been invited to a ${communication.type}
      
      Title: ${communication.title}
      Date: ${new Date(communication.date).toLocaleDateString()}
      Time: ${communication.startTime}
      ${communication.meetingUrl ? `Join URL: ${communication.meetingUrl}` : ''}
      
      Description: ${communication.description}
    `
  };

  // Send calendar invites
  const calendarInvite = {
    title: communication.title,
    description: communication.description,
    startTime: `${communication.date}T${communication.startTime}`,
    endTime: `${communication.date}T${communication.endTime}`,
    attendees: participantsList,
    location: communication.meetingUrl || ''
  };

  try {
    // Here you would implement actual email and calendar API calls
    console.log('Sending email notification:', emailNotification);
    console.log('Creating calendar invite:', calendarInvite);
  } catch (error) {
    console.error('Failed to send notifications:', error);
    throw error;
  }
}; 