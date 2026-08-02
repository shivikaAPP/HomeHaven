const jwt = require('jsonwebtoken');
const db = require('../db');
const { AppError } = require('../utils/errorResponse');

exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email === 'admin@homehaven.com' && password === 'admin123') {
      const token = jwt.sign({ id: 'admin' }, process.env.JWT_SECRET || 'homehaven_secret', { expiresIn: '7d' });
      return res.json({ success: true, token, admin: { email } });
    }
    throw new AppError('Invalid admin credentials', 401);
  } catch (error) {
    next(error);
  }
};

exports.getDashboard = async (req, res, next) => {
  try {
    const metrics = await db.countMetrics();
    const totalCategories = 12;
    res.json({ success: true, data: { ...metrics, totalCategories } });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await db.listUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await db.deleteUser(req.params.id);
    if (!user) throw new AppError('User not found', 404);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};
