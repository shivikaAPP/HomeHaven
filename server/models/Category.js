const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Category name is required'], unique: true, trim: true },
  slug: { type: String, required: true, lowercase: true, trim: true, unique: true },
  description: { type: String, default: '' },
  icon: { type: String, default: 'home' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
