const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Property = require('../models/Property');

const categories = [
  { name: 'Apartment', slug: 'apartment', description: 'Contemporary urban living with premium finishes.', icon: 'building' },
  { name: 'House', slug: 'house', description: 'Spacious homes designed for comfort and family living.', icon: 'house' },
  { name: 'Villa', slug: 'villa', description: 'Luxury villas with private gardens and views.', icon: 'tree-city' },
  { name: 'Farm House', slug: 'farm-house', description: 'Serene countryside retreats with space to breathe.', icon: 'barn' },
  { name: 'Penthouse', slug: 'penthouse', description: 'Sky-high residences with panoramic city views.', icon: 'tower-observation' },
  { name: 'Studio', slug: 'studio', description: 'Efficient, modern spaces perfect for city living.', icon: 'cube' },
  { name: 'Commercial', slug: 'commercial', description: 'Prime retail and business spaces.', icon: 'store' },
  { name: 'Warehouse', slug: 'warehouse', description: 'Flexible industrial spaces with strong logistics access.', icon: 'warehouse' },
  { name: 'Office', slug: 'office', description: 'Modern office environments for growing teams.', icon: 'briefcase' },
  { name: 'Plot', slug: 'plot', description: 'Untouched land with potential for future development.', icon: 'map-location-dot' },
  { name: 'Independent House', slug: 'independent-house', description: 'Private homes with elegant architecture.', icon: 'house-chimney' },
  { name: 'Luxury Home', slug: 'luxury-home', description: 'High-end residences with bespoke experiences.', icon: 'gem' }
];

const users = [
  { name: 'Maya Brooks', email: 'maya@homehaven.com', password: 'password123', phone: '+1 555 0144', address: 'Los Angeles, CA', role: 'user' },
  { name: 'Liam Carter', email: 'liam@homehaven.com', password: 'password123', phone: '+1 555 0152', address: 'Chicago, IL', role: 'user' },
  { name: 'Nina Singh', email: 'nina@homehaven.com', password: 'password123', phone: '+1 555 0158', address: 'Austin, TX', role: 'user' },
  { name: 'Daniel Ortiz', email: 'daniel@homehaven.com', password: 'password123', phone: '+1 555 0164', address: 'Miami, FL', role: 'user' },
  { name: 'Priya Shah', email: 'priya@homehaven.com', password: 'password123', phone: '+1 555 0172', address: 'San Francisco, CA', role: 'user' },
  { name: 'Ethan Brooks', email: 'ethan@homehaven.com', password: 'password123', phone: '+1 555 0180', address: 'Denver, CO', role: 'user' },
  { name: 'Sara Kim', email: 'sara@homehaven.com', password: 'password123', phone: '+1 555 0191', address: 'Seattle, WA', role: 'user' },
  { name: 'Admin', email: 'admin@homehaven.com', password: 'admin123', role: 'admin' }
];

const propertyTemplates = [
  { title: 'Harbor View Residence', address: '210 Bay Avenue', city: 'Miami', bedrooms: 4, bathrooms: 3, area: 3200, price: 980000, propertyType: 'Villa', images: ['https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80'], amenities: ['Pool','Garden','Garage','Security'], featured: true },
  { title: 'Skyline Penthouse', address: '88 West Street', city: 'New York', bedrooms: 3, bathrooms: 2, area: 2600, price: 1450000, propertyType: 'Penthouse', images: ['https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'], amenities: ['Balcony','Gym','Concierge','Parking'], featured: true },
  { title: 'Garden Apartment', address: '145 Oak Avenue', city: 'Seattle', bedrooms: 2, bathrooms: 2, area: 1800, price: 620000, propertyType: 'Apartment', images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=900&q=80'], amenities: ['Balcony','Laundry','Security','Parking'], featured: true },
  { title: 'Modern Family House', address: '33 Pine Lane', city: 'Austin', bedrooms: 4, bathrooms: 3, area: 3100, price: 780000, propertyType: 'House', images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80'], amenities: ['Backyard','Study','Fireplace','EV Charger'], featured: true },
  { title: 'Luxury Farm House', address: '98 Orchard Road', city: 'Nashville', bedrooms: 5, bathrooms: 4, area: 4100, price: 860000, propertyType: 'Farm House', images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80'], amenities: ['Pool','Garden','Stable','Panoramic View'], featured: true },
  { title: 'Bright Studio Loft', address: '12 Market Street', city: 'Denver', bedrooms: 1, bathrooms: 1, area: 1100, price: 410000, propertyType: 'Studio', images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80'], amenities: ['Open Plan','Built-in Storage','Laundry'], featured: false },
  { title: 'Executive Office Suite', address: '500 Commerce Avenue', city: 'Chicago', bedrooms: 0, bathrooms: 2, area: 2600, price: 540000, propertyType: 'Office', images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'], amenities: ['Meeting Room','Reception','Parking'], featured: false },
  { title: 'Logistics Warehouse', address: '77 Industrial Park', city: 'Phoenix', bedrooms: 0, bathrooms: 1, area: 6200, price: 780000, propertyType: 'Warehouse', images: ['https://images.unsplash.com/photo-1581092919535-8b2d4b4e2f0b?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80'], amenities: ['Loading Dock','High Ceiling','Security'], featured: false },
  { title: 'Boutique Commercial Plaza', address: '900 Main Street', city: 'San Diego', bedrooms: 0, bathrooms: 2, area: 3400, price: 910000, propertyType: 'Commercial', images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80'], amenities: ['Retail Frontage','Parking','WiFi'], featured: false },
  { title: 'Prime Plot Development', address: '650 Willow Road', city: 'Las Vegas', bedrooms: 0, bathrooms: 0, area: 9800, price: 330000, propertyType: 'Plot', images: ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=80'], amenities: ['Open Land','Road Access','Utilities'], featured: false },
  { title: 'Independent Luxury House', address: '11 Riverside Drive', city: 'Charlotte', bedrooms: 5, bathrooms: 4, area: 4200, price: 1120000, propertyType: 'Independent House', images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80'], amenities: ['Sauna','Garden','Home Office','Garage'], featured: true },
  { title: 'Terrace Luxury Home', address: '42 Summit Street', city: 'Beverly Hills', bedrooms: 6, bathrooms: 5, area: 5200, price: 1680000, propertyType: 'Luxury Home', images: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80'], amenities: ['Chef Kitchen','Smart Home','Cinema','Spa'], featured: true },
  { title: 'Riverside Townhouse', address: '500 Harbor Loop', city: 'San Francisco', bedrooms: 3, bathrooms: 3, area: 2600, price: 1220000, propertyType: 'House', images: ['https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80'], amenities: ['Terrace','Fireplace','Home Office','Garage'], featured: false },
  { title: 'Coastal Apartment', address: '88 Crescent Road', city: 'Santa Monica', bedrooms: 2, bathrooms: 2, area: 1700, price: 740000, propertyType: 'Apartment', images: ['https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80'], amenities: ['Ocean View','Doorman','Gym','Parking'], featured: false },
  { title: 'Skyline Residence', address: '320 Rose Avenue', city: 'Los Angeles', bedrooms: 4, bathrooms: 4, area: 3500, price: 1360000, propertyType: 'Apartment', images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80'], amenities: ['City View','Concierge','Pool','Security'], featured: true },
  { title: 'Sunlit Villa', address: '19 Desert Ridge', city: 'Scottsdale', bedrooms: 5, bathrooms: 4, area: 4600, price: 1180000, propertyType: 'Villa', images: ['https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80'], amenities: ['Pool','Outdoor Kitchen','Security','Garden'], featured: true },
  { title: 'Urban Studio', address: '27 Hudson Street', city: 'Brooklyn', bedrooms: 1, bathrooms: 1, area: 950, price: 390000, propertyType: 'Studio', images: ['https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'], amenities: ['Open Plan','Hardwood Floors','Laundry'], featured: false },
  { title: 'Corporate Campus Office', address: '1000 Market Plaza', city: 'Dallas', bedrooms: 0, bathrooms: 2, area: 3100, price: 680000, propertyType: 'Office', images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80'], amenities: ['Conference Room','Reception','Parking'], featured: false },
  { title: 'Modern Logistics Hub', address: '610 Rail Road', city: 'Atlanta', bedrooms: 0, bathrooms: 1, area: 7000, price: 840000, propertyType: 'Warehouse', images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1581092919535-8b2d4b4e2f0b?auto=format&fit=crop&w=900&q=80'], amenities: ['Dock','24/7 Security','High Ceilings'], featured: false },
  { title: 'Resort Villa', address: '923 Palm Avenue', city: 'Miami', bedrooms: 5, bathrooms: 4, area: 4700, price: 1580000, propertyType: 'Villa', images: ['https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80'], amenities: ['Pool','Infinity View','Garden','Jacuzzi'], featured: true },
  { title: 'Family Compound', address: '77 Willow Creek', city: 'Austin', bedrooms: 6, bathrooms: 5, area: 4800, price: 1320000, propertyType: 'Independent House', images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80'], amenities: ['Guest House','Garden','Gym','Home Theater'], featured: true },
  { title: 'Greenhouse Penthouse', address: '10 Madison Avenue', city: 'Chicago', bedrooms: 3, bathrooms: 3, area: 2800, price: 1180000, propertyType: 'Penthouse', images: ['https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80'], amenities: ['Terrace','Concierge','Fitness Center','Parking'], featured: false },
  { title: 'Heritage Commercial', address: '142 Grand Avenue', city: 'Miami', bedrooms: 0, bathrooms: 2, area: 3600, price: 960000, propertyType: 'Commercial', images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80'], amenities: ['Historic Charm','Parking','High Footfall'], featured: false },
  { title: 'Terrace Plot', address: '700 Orchard Lane', city: 'Denver', bedrooms: 0, bathrooms: 0, area: 12500, price: 420000, propertyType: 'Plot', images: ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=900&q=80','https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=80'], amenities: ['Open Land','Road Access','Utilities','Scenic Views'], featured: false }
];

async function seedData() {
  const existingCategories = await Category.countDocuments();
  const existingProperties = await Property.countDocuments();
  const existingUsers = await User.countDocuments();
  if (existingCategories && existingProperties && existingUsers) return;

  await Category.deleteMany({});
  await Property.deleteMany({});
  await User.deleteMany({});

  const createdCategories = await Category.insertMany(categories);
  const createdUsers = await User.insertMany(users);

  const properties = propertyTemplates.map((property, index) => ({
    ...property,
    slug: property.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: `A premium ${property.propertyType.toLowerCase()} designed for modern living with striking architecture, premium amenities, and seamless indoor-outdoor comfort.`,
    ownerName: createdUsers[index % createdUsers.length].name,
    ownerEmail: createdUsers[index % createdUsers.length].email,
    ownerPhone: '+1 555 0100',
    category: createdCategories.find(cat => cat.name.toLowerCase() === property.propertyType.toLowerCase() || cat.name.toLowerCase() === property.propertyType.toLowerCase().replace(/ /g, '-'))?._id || createdCategories[0]._id
  }));

  await Property.insertMany(properties);
}

module.exports = { seedData };
