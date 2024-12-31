require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD.replace(/\s/g, '')
  },
  debug: true
});

async function testEmail() {
  try {
    // Log configuration for debugging
    console.log('Environment variables loaded:');
    console.log('EMAIL_USERNAME:', process.env.EMAIL_USERNAME);
    console.log('EMAIL_PASSWORD length:', process.env.EMAIL_PASSWORD?.length);
    console.log('EMAIL_FROM_NAME:', process.env.EMAIL_FROM_NAME);

    console.log('\nTesting email configuration...');

    const info = await transporter.sendMail({
      from: {
        name: process.env.EMAIL_FROM_NAME || 'Test App',
        address: process.env.EMAIL_USERNAME
      },
      to: process.env.EMAIL_USERNAME,
      subject: 'Test Email Configuration',
      text: 'If you receive this email, your email configuration is working correctly!'
    });

    console.log('\nTest email sent successfully:', info.messageId);
  } catch (error) {
    console.error('\nError sending test email:', error);
    
    if (error.code === 'EAUTH') {
      console.log('\nPossible solutions:');
      console.log('1. Make sure 2-Step Verification is enabled in your Google Account');
      console.log('2. Generate a new App Password:');
      console.log('   a. Go to https://myaccount.google.com/security');
      console.log('   b. Click on 2-Step Verification');
      console.log('   c. Scroll down to App passwords');
      console.log('   d. Generate a new password for "Mail" and "Other (Custom name)"');
      console.log('3. Copy the generated password (16 characters, no spaces)');
      console.log('4. Update EMAIL_PASSWORD in your .env file');
    }
  }
}

testEmail(); 