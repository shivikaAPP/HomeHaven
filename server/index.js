const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const multer = require('multer');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });
app.use('/uploads', express.static(uploadDir));

app.use(express.static(path.join(__dirname, '..', 'client')));

const User = require('./models/User');
const Property = require('./models/Property');
const Favourite = require('./models/Favourite');
const Enquiry = require('./models/Enquiry');

const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const favouriteRoutes = require('./routes/favourites');
const enquiryRoutes = require('./routes/enquiries');
const adminRoutes = require('./routes/admin');
const categoryRoutes = require('./routes/categories');
const { seedData } = require('./utils/seedData');

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/favourites', favouriteRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/homehaven', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('MongoDB connected');
  await seedData();
  console.log('Seed data ready');
}).catch(err => console.error(err));

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image uploaded' });
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
