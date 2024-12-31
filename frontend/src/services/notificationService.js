import emailjs from '@emailjs/browser';

const EMAIL_SERVICE_ID = 'your_service_id';
const EMAIL_TEMPLATE_ID = 'your_template_id';
const EMAIL_USER_ID = 'your_user_id';

export const sendEmailNotification = async (communication) => {
  try {
    const templateParams = {
      to_email: communication.participants.join(', '),
      subject: communication.subject,
      company: communication.company,
      date: new Date(communication.date).toLocaleDateString(),
      time: communication.time,
      type: communication.type,
      notes: communication.notes
    };

    const response = await emailjs.send(
      EMAIL_SERVICE_ID,
      EMAIL_TEMPLATE_ID,
      templateParams,
      EMAIL_USER_ID
    );

    return response;
  } catch (error) {
    console.error('Email notification failed:', error);
    throw error;
  }
};

export const sendReminderNotification = async (communication) => {
  try {
    const templateParams = {
      to_email: communication.participants.join(', '),
      subject: `Reminder: ${communication.subject}`,
      company: communication.company,
      date: new Date(communication.date).toLocaleDateString(),
      time: communication.time,
      type: communication.type,
      notes: communication.notes
    };

    const response = await emailjs.send(
      EMAIL_SERVICE_ID,
      EMAIL_TEMPLATE_ID,
      templateParams,
      EMAIL_USER_ID
    );

    return response;
  } catch (error) {
    console.error('Reminder notification failed:', error);
    throw error;
  }
}; 