const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('../utils/errorResponse');

module.exports = async function auth(req, res, next) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new AppError('No token, authorization denied', 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'homehaven_secret');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) throw new AppError('User not found', 404);
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
