const cors = require('cors');
const analyticsRoutes = require('./routes/analytics');

app.use(cors({
  origin: '*', // Your frontend URL
  credentials: true
}));

// Add this line with your other routes
app.use('/api/user', require('./routes/user'));
app.use('/api/analytics', analyticsRoutes); 