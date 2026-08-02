const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const sampleProperties = [
  {
    _id: 'prop-1',
    title: 'Luxury Coastal Villa',
    description: 'A contemporary villa with ocean views, private garden, and premium finishes.',
    price: 890000,
    address: 'Beverly Hills',
    location: 'Beverly Hills',
    city: 'Los Angeles',
    bedrooms: 5,
    bathrooms: 4,
    area: 4200,
    propertyType: 'Villa',
    type: 'Villa',
    images: ['https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80'],
    amenities: ['Pool', 'Garage', 'Garden', 'Security'],
    ownerName: 'Maya Brooks',
    ownerEmail: 'maya@homehaven.com',
    ownerPhone: '+1 555 0144',
    featured: true
  },
  {
    _id: 'prop-2',
    title: 'Modern Downtown Flat',
    description: 'Bright flat near business district with breathtaking skyline views.',
    price: 520000,
    address: 'Downtown',
    location: 'Downtown',
    city: 'Chicago',
    bedrooms: 3,
    bathrooms: 2,
    area: 2100,
    propertyType: 'Flat',
    type: 'Flat',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80'],
    amenities: ['Gym', 'Balcony', 'Concierge', 'Parking'],
    ownerName: 'Liam Carter',
    ownerEmail: 'liam@homehaven.com',
    ownerPhone: '+1 555 0152',
    featured: true
  },
  {
    _id: 'prop-3',
    title: 'Elegant Family House',
    description: 'Spacious family home with natural light and an inviting open plan.',
    price: 710000,
    address: 'Westfield',
    location: 'Westfield',
    city: 'Austin',
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    propertyType: 'House',
    type: 'House',
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80'],
    amenities: ['Backyard', 'Study', 'Fireplace', 'EV Charger'],
    ownerName: 'Nina Singh',
    ownerEmail: 'nina@homehaven.com',
    ownerPhone: '+1 555 0158',
    featured: true
  },
  {
    _id: 'prop-4',
    title: 'Premium Plot in Greenbelt',
    description: 'A rare investment plot with easy access to schools, parks, and transport.',
    price: 240000,
    address: 'Greenbelt',
    location: 'Greenbelt',
    city: 'Seattle',
    bedrooms: 0,
    bathrooms: 0,
    area: 6500,
    propertyType: 'Plot',
    type: 'Plot',
    images: ['https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=900&q=80'],
    amenities: ['Road Access', 'Utilities', 'Security Gate'],
    ownerName: 'Ava Patel',
    ownerEmail: 'ava@homehaven.com',
    ownerPhone: '+1 555 0169',
    featured: false
  }
];

const state = {
  users: [],
  properties: sampleProperties.map(p => ({ ...p })),
  favourites: [],
  enquiries: []
};

function useMongo() {
  return mongoose.connection.readyState === 1;
}

async function createUser(data) {
  if (useMongo()) {
    const User = require('./models/User');
    const user = new User(data);
    await user.save();
    return user;
  }
  const user = {
    _id: `usr-${Date.now()}`,
    ...data,
    role: 'user',
    createdAt: new Date()
  };
  user.password = await bcrypt.hash(data.password, 10);
  user.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.password);
  };
  state.users.push(user);
  return user;
}

async function findUserByEmail(email) {
  if (useMongo()) {
    const User = require('./models/User');
    return User.findOne({ email });
  }
  return state.users.find(user => user.email === email) || null;
}

async function findUserById(id) {
  if (useMongo()) {
    const User = require('./models/User');
    return User.findById(id).select('-password');
  }
  return state.users.find(user => user._id === id) || null;
}

async function updateUser(id, updates) {
  if (useMongo()) {
    const User = require('./models/User');
    return User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
  }
  const user = state.users.find(entry => entry._id === id);
  if (!user) return null;
  Object.assign(user, updates);
  return { ...user };
}

async function deleteUser(id) {
  if (useMongo()) {
    const User = require('./models/User');
    return User.findByIdAndDelete(id);
  }
  state.users = state.users.filter(user => user._id !== id);
  return { success: true };
}

async function listProperties(query = {}) {
  if (useMongo()) {
    const Property = require('./models/Property');
    return Property.find(query).sort({ createdAt: -1 });
  }
  let result = [...state.properties];
  const { search, city, type, minPrice, maxPrice, bedrooms } = query;
  if (search) {
    const regex = new RegExp(search, 'i');
    result = result.filter(item => regex.test(item.title) || regex.test(item.city) || regex.test(item.address));
  }
  if (city) {
    result = result.filter(item => item.city.toLowerCase().includes(city.toLowerCase()));
  }
  if (type) {
    result = result.filter(item => (item.propertyType || item.type) === type);
  }
  if (minPrice || maxPrice) {
    result = result.filter(item => {
      if (minPrice && item.price < Number(minPrice)) return false;
      if (maxPrice && item.price > Number(maxPrice)) return false;
      return true;
    });
  }
  if (bedrooms) {
    result = result.filter(item => item.bedrooms === Number(bedrooms));
  }
  return result;
}

async function getFeaturedProperties() {
  if (useMongo()) {
    const Property = require('./models/Property');
    return Property.find({ featured: true }).limit(6);
  }
  return state.properties.filter(item => item.featured).slice(0, 6);
}

async function getPropertyById(id) {
  if (useMongo()) {
    const Property = require('./models/Property');
    return Property.findById(id);
  }
  return state.properties.find(item => item._id === id) || null;
}

async function createProperty(data) {
  if (useMongo()) {
    const Property = require('./models/Property');
    const property = new Property(data);
    await property.save();
    return property;
  }
  const property = {
    _id: `prop-${Date.now()}`,
    ...data,
    createdAt: new Date()
  };
  state.properties.unshift(property);
  return property;
}

async function updateProperty(id, data) {
  if (useMongo()) {
    const Property = require('./models/Property');
    return Property.findByIdAndUpdate(id, data, { new: true });
  }
  const index = state.properties.findIndex(item => item._id === id);
  if (index === -1) return null;
  state.properties[index] = { ...state.properties[index], ...data };
  return state.properties[index];
}

async function deleteProperty(id) {
  if (useMongo()) {
    const Property = require('./models/Property');
    return Property.findByIdAndDelete(id);
  }
  state.properties = state.properties.filter(item => item._id !== id);
  state.favourites = state.favourites.filter(item => item.property !== id);
  return { success: true };
}

async function listFavourites(userId) {
  if (useMongo()) {
    const Favourite = require('./models/Favourite');
    return Favourite.find({ user: userId }).populate('property');
  }
  return state.favourites.filter(item => item.user === userId).map(item => ({ ...item, property: state.properties.find(prop => prop._id === item.property) }));
}

async function addFavourite(userId, propertyId) {
  if (useMongo()) {
    const Favourite = require('./models/Favourite');
    const existing = await Favourite.findOne({ user: userId, property: propertyId });
    if (existing) return existing;
    const favourite = new Favourite({ user: userId, property: propertyId });
    await favourite.save();
    return favourite;
  }
  const existing = state.favourites.find(item => item.user === userId && item.property === propertyId);
  if (existing) return existing;
  const favourite = { _id: `fav-${Date.now()}`, user: userId, property: propertyId, createdAt: new Date() };
  state.favourites.push(favourite);
  return favourite;
}

async function removeFavourite(userId, propertyId) {
  if (useMongo()) {
    const Favourite = require('./models/Favourite');
    return Favourite.deleteOne({ user: userId, property: propertyId });
  }
  state.favourites = state.favourites.filter(item => !(item.user === userId && item.property === propertyId));
  return { success: true };
}

async function createEnquiry(data) {
  if (useMongo()) {
    const Enquiry = require('./models/Enquiry');
    const enquiry = new Enquiry(data);
    await enquiry.save();
    return enquiry;
  }
  const enquiry = { _id: `inq-${Date.now()}`, ...data, createdAt: new Date() };
  state.enquiries.unshift(enquiry);
  return enquiry;
}

async function listEnquiries() {
  if (useMongo()) {
    const Enquiry = require('./models/Enquiry');
    return Enquiry.find().sort({ createdAt: -1 });
  }
  return [...state.enquiries];
}

async function updateEnquiry(id, data) {
  if (useMongo()) {
    const Enquiry = require('./models/Enquiry');
    return Enquiry.findByIdAndUpdate(id, data, { new: true });
  }
  const index = state.enquiries.findIndex(item => item._id === id);
  if (index === -1) return null;
  state.enquiries[index] = { ...state.enquiries[index], ...data };
  return state.enquiries[index];
}

async function deleteEnquiry(id) {
  if (useMongo()) {
    const Enquiry = require('./models/Enquiry');
    return Enquiry.findByIdAndDelete(id);
  }
  state.enquiries = state.enquiries.filter(item => item._id !== id);
  return { success: true };
}

async function countMetrics() {
  if (useMongo()) {
    const User = require('./models/User');
    const Property = require('./models/Property');
    const Enquiry = require('./models/Enquiry');
    const [totalUsers, totalProperties, totalEnquiries] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Enquiry.countDocuments()
    ]);
    return { totalUsers, totalProperties, totalEnquiries };
  }
  return { totalUsers: state.users.length, totalProperties: state.properties.length, totalEnquiries: state.enquiries.length };
}

async function listUsers() {
  if (useMongo()) {
    const User = require('./models/User');
    return User.find().select('-password');
  }
  return state.users.map(user => ({ ...user }));
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  deleteUser,
  listProperties,
  getFeaturedProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  listFavourites,
  addFavourite,
  removeFavourite,
  createEnquiry,
  listEnquiries,
  updateEnquiry,
  deleteEnquiry,
  countMetrics,
  listUsers
};
