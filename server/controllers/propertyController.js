const db = require('../db');
const { AppError } = require('../utils/errorResponse');

exports.getProperties = async (req, res, next) => {
  try {
    const { search, city, type, minPrice, maxPrice, bedrooms, bathrooms, area, sort } = req.query;
    const query = {};

    if (search) query.search = search;
    if (city) query.city = city;
    if (type) query.type = type;
    if (bedrooms) query.bedrooms = Number(bedrooms);
    if (bathrooms) query.bathrooms = Number(bathrooms);
    if (area) query.area = Number(area);
    if (minPrice || maxPrice) {
      query.minPrice = minPrice ? Number(minPrice) : undefined;
      query.maxPrice = maxPrice ? Number(maxPrice) : undefined;
    }

    let properties = await db.listProperties(query);
    if (sort === 'oldest') properties = properties.slice().sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    if (sort === 'lowest') properties = properties.slice().sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === 'highest') properties = properties.slice().sort((a, b) => (b.price || 0) - (a.price || 0));

    res.json({ success: true, data: properties });
  } catch (error) {
    next(error);
  }
};

exports.getPropertyById = async (req, res, next) => {
  try {
    const property = await db.getPropertyById(req.params.id);
    if (!property) throw new AppError('Property not found', 404);
    res.json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

exports.createProperty = async (req, res, next) => {
  try {
    const property = await db.createProperty(req.body);
    res.status(201).json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

exports.updateProperty = async (req, res, next) => {
  try {
    const property = await db.updateProperty(req.params.id, req.body);
    if (!property) throw new AppError('Property not found', 404);
    res.json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await db.deleteProperty(req.params.id);
    if (!property) throw new AppError('Property not found', 404);
    res.json({ success: true, message: 'Property deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getFeatured = async (req, res, next) => {
  try {
    const properties = await db.getFeaturedProperties();
    res.json({ success: true, data: properties });
  } catch (error) {
    next(error);
  }
};

exports.getByCategory = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const categoryNameMap = { apartment: 'Apartment', house: 'House', villa: 'Villa', 'farm-house': 'Farm House', penthouse: 'Penthouse', studio: 'Studio', commercial: 'Commercial', warehouse: 'Warehouse', office: 'Office', plot: 'Plot', 'independent-house': 'Independent House', 'luxury-home': 'Luxury Home' };
    const categoryName = categoryNameMap[slug] || slug.replace(/-/g, ' ');
    const properties = await db.listProperties({});
    const filtered = properties.filter(property => {
      const type = (property.propertyType || property.type || '').toLowerCase();
      return type === categoryName.toLowerCase() || type.replace(/ /g, '-') === slug;
    });
    const category = { slug, name: categoryName, description: `Premium ${categoryName.toLowerCase()} listings.` };
    res.json({ success: true, data: { category, properties: filtered } });
  } catch (error) {
    next(error);
  }
};
