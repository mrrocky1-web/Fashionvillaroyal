const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, default: 0 },
  category: { type: String, required: true, default: 'General' },
  images: [{ type: String, required: true }],
  meeshoUrl: { type: String, default: '' },
  flipkartUrl: { type: String, default: '' },
  amazonUrl: { type: String, default: '' },
  stock: { type: Number, default: 10, min: 0 },
  rating: { type: Number, default: 4.5 },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
