const jwt  = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect  —  Express middleware that validates the JWT from the
 * Authorization header and attaches the decoded user to req.user.
 *
 * Usage: router.get('/private', protect, handler)
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorised — no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user (without password) to the request
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'User belonging to this token no longer exists' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorised — token invalid or expired' });
  }
};

/**
 * requireAdmin — Express middleware that ensures the user is an admin.
 * Must be used AFTER protect middleware.
 */
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorised as an admin' });
  }
};

module.exports = { protect, requireAdmin };
