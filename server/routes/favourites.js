const express = require('express');
const router = express.Router();
const { getFavourites, toggleFavourite } = require('../controllers/favouriteController');
const { protect } = require('../middlewares/auth');

router.get('/', protect, getFavourites);
router.post('/:propertyId', protect, toggleFavourite);

module.exports = router;
