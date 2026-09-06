const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { verifyToken, requireSellerOrAdmin } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products with category filter and search term
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(category, 'i') };
    }

    if (search) {
      query.$or = [
        { title: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } },
        { category: { $regex: new RegExp(search, 'i') } }
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error('Fetch Products Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products.', error: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product details
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving product.' });
  }
});

// @route   POST /api/products
// @desc    Create new product (Seller or Admin) with Meesho/Flipkart URLs
router.post('/', verifyToken, requireSellerOrAdmin, async (req, res) => {
  try {
    const { title, description, price, originalPrice, category, images, meeshoUrl, flipkartUrl, amazonUrl, stock } = req.body;

    if (!title || !description || !price || !images || images.length === 0) {
      return res.status(400).json({ success: false, message: 'Title, description, price, and at least one image are required.' });
    }

    const newProduct = new Product({
      title,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price) * 1.25,
      category: category || 'General',
      images: Array.isArray(images) ? images : [images],
      meeshoUrl: meeshoUrl || '',
      flipkartUrl: flipkartUrl || '',
      amazonUrl: amazonUrl || '',
      stock: stock ? Number(stock) : 10,
      seller: req.user.id
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product listed successfully on Fashionvillaroyal!',
      product: newProduct
    });
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create product.', error: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product details
router.put('/:id', verifyToken, requireSellerOrAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Check ownership if seller
    if (req.user.role === 'seller' && product.seller && product.seller.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to edit this product.' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Product updated successfully!',
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product.', error: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
router.delete('/:id', verifyToken, requireSellerOrAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (req.user.role === 'seller' && product.seller && product.seller.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this product.' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product removed from Fashionvillaroyal catalog.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
});

module.exports = router;
