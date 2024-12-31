const isAdmin = (req, res, next) => {
  console.log('isAdmin middleware check:', {
    user: {
      id: req.user?._id,
      email: req.user?.email,
      role: req.user?.role
    },
    headers: req.headers,
    token: req.header('Authorization')
  });
  
  if (!req.user) {
    console.log('No user found in request');
    return res.status(403).json({ message: 'Access denied. No user found.' });
  }

  if (req.user.role !== 'admin') {
    console.log('User is not admin:', req.user.role);
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  console.log('Admin access granted');
  next();
};

module.exports = isAdmin; 