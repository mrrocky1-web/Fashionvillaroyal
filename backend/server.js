const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');

const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Healthcheck / Root route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    siteName: 'Fashionvillaroyal API',
    message: 'Backend server is running smoothly on Render!'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

// Default Admin creation helper
const seedDefaultAdmin = async () => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      const defaultAdmin = new User({
        name: 'Fashionvillaroyal Admin',
        email: 'admin@fashionvillaroyal.com',
        phone: '9999999999',
        password: hashedPassword,
        role: 'admin',
        storeName: 'Fashionvillaroyal Flagship'
      });
      await defaultAdmin.save();
      console.log('👑 Default Admin Created: admin@fashionvillaroyal.com / admin123');
    }
  } catch (err) {
    console.warn('Notice seeding default admin:', err.message);
  }
};

// Database Connection & Server Listener
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fashionvillaroyal';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Database (Fashionvillaroyal)');
    await seedDefaultAdmin();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('⚠️ MongoDB Connection Error:', err.message);
    console.log('ℹ️ Operating in fallback mode. Server will still listen...');
    app.listen(PORT, () => {
      console.log(`🚀 Express Server running on port ${PORT} (Offline DB fallback)`);
    });
  });
