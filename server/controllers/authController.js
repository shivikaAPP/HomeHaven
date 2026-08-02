const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { AppError } = require('../utils/errorResponse');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'homehaven_secret', { expiresIn: '7d' });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const existing = await db.findUserByEmail(email);
    if (existing) throw new AppError('Email already registered', 400);

    const user = await db.createUser({ name, email, password, phone, address });
    res.status(201).json({ success: true, token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await db.findUserByEmail(email);
    if (!user) throw new AppError('Invalid credentials', 401);

    const isMatch = user.comparePassword ? await user.comparePassword(password) : await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError('Invalid credentials', 401);

    res.json({ success: true, token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    const user = await db.updateUser(req.user._id, updates);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
