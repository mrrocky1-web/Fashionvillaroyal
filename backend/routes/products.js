const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, count: 0, products: [] });
    }

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
    res.json({ success: true, count: 0, products: [] });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database connecting, please try again.' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving product.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, price, originalPrice, category, images, meeshoUrl, flipkartUrl, customMarketplaceUrl, stock, colors, acceptedPayments } = req.body;

    if (!title || !description || !price || !images || images.length === 0) {
      return res.status(400).json({ success: false, message: 'Title, description, price, and image are required.' });
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
      customMarketplaceUrl: customMarketplaceUrl || '',
      colors: Array.isArray(colors) ? colors : [],
      acceptedPayments: Array.isArray(acceptedPayments) ? acceptedPayments : ['COD', 'UPI'],
      stock: stock ? Number(stock) : 50
    });

    await newProduct.save();
    res.status(201).json({ success: true, message: 'Product created!', product: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create product.', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json({ success: true, message: 'Product updated!', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
});

module.exports = router;
