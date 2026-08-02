const express = require('express');
const router = express.Router();
const { createEnquiry, getEnquiries, updateEnquiry, deleteEnquiry } = require('../controllers/enquiryController');
const { protect, authorizeRoles } = require('../middlewares/auth');

router.post('/', protect, createEnquiry);
router.get('/', protect, authorizeRoles('admin'), getEnquiries);
router.put('/:id', protect, authorizeRoles('admin'), updateEnquiry);
router.delete('/:id', protect, authorizeRoles('admin'), deleteEnquiry);

module.exports = router;
