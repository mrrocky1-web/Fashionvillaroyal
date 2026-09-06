const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Default initial settings helper
const getOrCreateSettings = async () => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = new Setting({
      siteName: 'Fashionvillaroyal',
      announcementText: 'We are available in Meesho, Flipkart, Amazon etc.',
      supportEmail: 'fhub0021@gmail.com',
      carouselSlides: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200',
          title: 'Royal Ethnic Collection 2026',
          subtitle: 'Up to 60% OFF on Sarees, Suits & Kurties',
          badgeText: 'Trending Now',
          linkUrl: '#shop',
          buttonText: 'Shop Collection'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200',
          title: 'Exclusive Fashion & Accessories',
          subtitle: 'Directly from Top Manufacturers',
          badgeText: 'Best Prices',
          linkUrl: '#shop',
          buttonText: 'Explore Offers'
        }
      ],
      offerBanners: [
        {
          title: 'Festive Flash Sale',
          description: 'Flat ₹200 OFF on your first purchase above ₹999',
          code: 'FASHION200',
          discountText: 'FLAT ₹200 OFF'
        }
      ]
    });
    await settings.save();
  }
  return settings;
};

// @route   GET /api/admin/settings
// @desc    Get site CMS settings (Public route for storefront rendering)
router.get('/settings', async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json({ success: true, settings });
  } catch (error) {
    console.error('Fetch Settings Error:', error);
    res.status(500).json({ success: false, message: 'Failed to load site configuration.', error: error.message });
  }
});

// @route   PUT /api/admin/settings
// @desc    Update website CMS settings, banners, announcement, carousel (Admin only)
router.put('/settings', verifyToken, requireAdmin, async (req, res) => {
  try {
    let settings = await getOrCreateSettings();

    const { announcementText, supportEmail, carouselSlides, offerBanners } = req.body;

    if (announcementText !== undefined) settings.announcementText = announcementText;
    if (supportEmail !== undefined) settings.supportEmail = supportEmail;
    if (Array.isArray(carouselSlides)) settings.carouselSlides = carouselSlides;
    if (Array.isArray(offerBanners)) settings.offerBanners = offerBanners;

    await settings.save();

    res.json({
      success: true,
      message: 'Website CMS settings updated successfully! Front page slides and advertisements updated.',
      settings
    });
  } catch (error) {
    console.error('Update Settings Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update site settings.', error: error.message });
  }
});

// @route   GET /api/admin/stats
// @desc    Get Admin Dashboard Overview Stats
router.get('/stats', verifyToken, requireAdmin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalSellers = await User.countDocuments({ role: 'seller' });

    const orders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
    const totalRevenue = orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalSellers,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load admin stats.' });
  }
});

module.exports = router;
