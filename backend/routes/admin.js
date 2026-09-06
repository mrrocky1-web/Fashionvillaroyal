const express = require('express');
const router = express.Router();

let siteSettings = {
  siteName: 'Fashionvillaroyal',
  announcementText: 'We are available in Meesho, Flipkart, Amazon etc.',
  supportEmail: 'fhub0021@gmail.com',
  carouselSlides: [
    {
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200',
      title: 'Royal Ethnic Collection 2026',
      subtitle: 'Up to 60% OFF on Sarees, Suits & Kurties',
      badgeText: 'Trending Now',
      linkUrl: '#catalogSection',
      buttonText: 'Shop Collection'
    }
  ],
  offerBanners: []
};

router.get('/settings', async (req, res) => {
  res.json({ success: true, settings: siteSettings });
});

router.put('/settings', async (req, res) => {
  if (req.body) siteSettings = { ...siteSettings, ...req.body };
  res.json({ success: true, message: 'Settings updated!', settings: siteSettings });
});

router.get('/stats', async (req, res) => {
  res.json({ success: true, stats: { totalProducts: 12, totalOrders: 5, totalUsers: 25, totalRevenue: 15400 } });
});

module.exports = router;
