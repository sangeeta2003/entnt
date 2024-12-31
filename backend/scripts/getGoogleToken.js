const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:5000/auth/google/callback'
);

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://mail.google.com/']
});

console.log('Visit this URL to get the auth code:', url);

// After getting the code, run this:
oauth2Client.getToken(code, (err, tokens) => {
  if (err) return console.error('Error getting tokens:', err);
  console.log('Tokens:', tokens);
}); 