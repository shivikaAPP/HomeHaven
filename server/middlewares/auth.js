const jwt = require('jsonwebtoken');
const db = require('../db');
const { AppError } = require('../utils/errorResponse');

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new AppError('Authorization token missing', 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'homehaven_secret');
    const user = await db.findUserById(decoded.id);
    if (!user) throw new AppError('User not found', 404);

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return next(new AppError('Access denied', 403));
  }
  next();
};

module.exports = { protect, authorizeRoles };
