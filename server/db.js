const mongoose = require('mongoose');
const store = require('./store');

const isMongoReady = () => mongoose.connection.readyState === 1;

module.exports = {
  isMongoReady,
  createUser: (...args) => isMongoReady() ? require('./models/User').create(...args) : store.createUser(...args),
  findUserByEmail: (...args) => isMongoReady() ? require('./models/User').findOne({ email: args[0] }) : store.findUserByEmail(...args),
  findUserById: (...args) => isMongoReady() ? require('./models/User').findById(args[0]).select('-password') : store.findUserById(...args),
  updateUser: (...args) => isMongoReady() ? require('./models/User').findByIdAndUpdate(args[0], args[1], { new: true }).select('-password') : store.updateUser(...args),
  deleteUser: (...args) => isMongoReady() ? require('./models/User').findByIdAndDelete(args[0]) : store.deleteUser(...args),
  listProperties: (...args) => isMongoReady() ? require('./models/Property').find(args[0] || {}).sort({ createdAt: -1 }) : store.listProperties(...args),
  getFeaturedProperties: (...args) => isMongoReady() ? require('./models/Property').find({ featured: true }).limit(6) : store.getFeaturedProperties(...args),
  getPropertyById: (...args) => isMongoReady() ? require('./models/Property').findById(args[0]) : store.getPropertyById(...args),
  createProperty: (...args) => isMongoReady() ? new (require('./models/Property'))(args[0]).save() : store.createProperty(...args),
  updateProperty: (...args) => isMongoReady() ? require('./models/Property').findByIdAndUpdate(args[0], args[1], { new: true }) : store.updateProperty(...args),
  deleteProperty: (...args) => isMongoReady() ? require('./models/Property').findByIdAndDelete(args[0]) : store.deleteProperty(...args),
  listFavourites: (...args) => isMongoReady() ? require('./models/Favourite').find({ user: args[0] }).populate('property') : store.listFavourites(...args),
  addFavourite: (...args) => isMongoReady() ? (async () => { const Favourite = require('./models/Favourite'); const existing = await Favourite.findOne({ user: args[0], property: args[1] }); if (existing) return existing; const favourite = new Favourite({ user: args[0], property: args[1] }); await favourite.save(); return favourite; })() : store.addFavourite(...args),
  removeFavourite: (...args) => isMongoReady() ? require('./models/Favourite').deleteOne({ user: args[0], property: args[1] }) : store.removeFavourite(...args),
  createEnquiry: (...args) => isMongoReady() ? new (require('./models/Enquiry'))(args[0]).save() : store.createEnquiry(...args),
  listEnquiries: (...args) => isMongoReady() ? require('./models/Enquiry').find().sort({ createdAt: -1 }) : store.listEnquiries(...args),
  updateEnquiry: (...args) => isMongoReady() ? require('./models/Enquiry').findByIdAndUpdate(args[0], args[1], { new: true }) : store.updateEnquiry(...args),
  deleteEnquiry: (...args) => isMongoReady() ? require('./models/Enquiry').findByIdAndDelete(args[0]) : store.deleteEnquiry(...args),
  countMetrics: (...args) => isMongoReady() ? (async () => { const User = require('./models/User'); const Property = require('./models/Property'); const Enquiry = require('./models/Enquiry'); const [totalUsers, totalProperties, totalEnquiries] = await Promise.all([User.countDocuments(), Property.countDocuments(), Enquiry.countDocuments()]); return { totalUsers, totalProperties, totalEnquiries }; })() : store.countMetrics(...args),
  listUsers: (...args) => isMongoReady() ? require('./models/User').find().select('-password') : store.listUsers(...args)
};
