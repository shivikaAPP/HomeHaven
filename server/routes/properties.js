const express = require('express');
const router = express.Router();
const { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty, getFeatured, getByCategory } = require('../controllers/propertyController');
const { protect, authorizeRoles } = require('../middlewares/auth');

router.get('/', getProperties);
router.get('/featured', getFeatured);
router.get('/category/:slug', getByCategory);
router.get('/:id', getPropertyById);
router.post('/', protect, authorizeRoles('admin'), createProperty);
router.put('/:id', protect, authorizeRoles('admin'), updateProperty);
router.delete('/:id', protect, authorizeRoles('admin'), deleteProperty);

module.exports = router;
