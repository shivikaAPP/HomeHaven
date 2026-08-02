const express = require('express');
const router = express.Router();
const { adminLogin, getDashboard, getUsers, deleteUser } = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middlewares/auth');

router.post('/login', adminLogin);
router.get('/dashboard', protect, authorizeRoles('admin'), getDashboard);
router.get('/users', protect, authorizeRoles('admin'), getUsers);
router.delete('/users/:id', protect, authorizeRoles('admin'), deleteUser);

module.exports = router;
