const db = require('../db');
const { AppError } = require('../utils/errorResponse');

exports.getFavourites = async (req, res, next) => {
  try {
    const favourites = await db.listFavourites(req.user._id);
    res.json({ success: true, data: favourites });
  } catch (error) {
    next(error);
  }
};

exports.toggleFavourite = async (req, res, next) => {
  try {
    const property = await db.getPropertyById(req.params.propertyId);
    if (!property) throw new AppError('Property not found', 404);

    const existing = await db.listFavourites(req.user._id);
    const match = existing.find(item => item.property?._id === req.params.propertyId || item.property === req.params.propertyId);
    if (match) {
      await db.removeFavourite(req.user._id, req.params.propertyId);
      return res.json({ success: true, message: 'Removed from favourites' });
    }

    const favourite = await db.addFavourite(req.user._id, req.params.propertyId);
    res.status(201).json({ success: true, data: favourite });
  } catch (error) {
    next(error);
  }
};
