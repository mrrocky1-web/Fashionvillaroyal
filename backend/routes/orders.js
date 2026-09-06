const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Place a new order (Supports guest or authenticated customer checkout)
router.post('/', async (req, res) => {
  try {
    const { items, totalAmount, shippingDetails, paymentMethod } = req.body;

    // Contact details & form validation to prevent checkout bugs
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty. Please add items to checkout.' });
    }

    if (!shippingDetails) {
      return res.status(400).json({ success: false, message: 'Shipping contact details are required.' });
    }

    const { fullName, email, phone, address, city, pincode } = shippingDetails;
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your full name.' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }
    if (!phone || phone.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number.' });
    }
    if (!address || !address.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your delivery street address.' });
    }
    if (!city || !city.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your city.' });
    }
    if (!pincode || pincode.trim().length < 6) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 6-digit postal pincode.' });
    }

    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = require('jsonwebtoken').verify(
          token,
          process.env.JWT_SECRET || 'fashionvillaroyal_super_secret_jwt_key_2026'
        );
        userId = decoded.id;
      } catch (err) {
        // Guest order fallback if token invalid
      }
    }

    const newOrder = new Order({
      user: userId,
      items,
      totalAmount,
      shippingDetails: {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
        state: shippingDetails.state || 'India'
      },
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'Online' ? 'Completed' : 'Pending',
      orderStatus: 'Placed'
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Thank you for shopping with Fashionvillaroyal.',
      orderId: newOrder._id,
      order: newOrder
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ success: false, message: 'Failed to place order.', error: error.message });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get logged in customer's order history
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve order history.' });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin only)
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin orders.' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin only)
router.put('/:id/status', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    if (!orderStatus) {
      return res.status(400).json({ success: false, message: 'Order status is required.' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.json({ success: true, message: `Order status updated to ${orderStatus}`, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
});

module.exports = router;
