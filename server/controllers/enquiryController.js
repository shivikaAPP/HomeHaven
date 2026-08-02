const db = require('../db');
const { AppError } = require('../utils/errorResponse');

exports.createEnquiry = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (req.user) payload.userId = req.user._id;
    if (payload.propertyId) {
      const property = await db.getPropertyById(payload.propertyId);
      if (!property) throw new AppError('Property not found', 404);
    }
    const enquiry = await db.createEnquiry(payload);
    res.status(201).json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
};

exports.getEnquiries = async (req, res, next) => {
  try {
    const enquiries = await db.listEnquiries();
    res.json({ success: true, data: enquiries });
  } catch (error) {
    next(error);
  }
};

exports.updateEnquiry = async (req, res, next) => {
  try {
    const enquiry = await db.updateEnquiry(req.params.id, req.body);
    if (!enquiry) throw new AppError('Enquiry not found', 404);
    res.json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
};

exports.deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await db.deleteEnquiry(req.params.id);
    if (!enquiry) throw new AppError('Enquiry not found', 404);
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (error) {
    next(error);
  }
};
