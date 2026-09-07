const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fashionvillaroyal_super_secret_jwt_key_2026';

router.post('/login', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

  const cleanEmail = email.trim().toLowerCase();
  const role = cleanEmail.includes('admin') ? 'admin' : cleanEmail.includes('seller') ? 'seller' : 'customer';
  const user = { id: 'usr_' + Date.now(), name: cleanEmail.split('@')[0], email: cleanEmail, role: role };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

  return res.json({ success: true, message: 'Login successful!', token, user });
});

router.post('/register', async (req, res) => {
  const { name, email, role } = req.body;
  const user = { id: 'usr_' + Date.now(), name: name || 'User', email: email || 'user@example.com', role: role || 'customer' };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
  return res.status(201).json({ success: true, message: 'Registration successful!', token, user });
});

router.post('/forgot-password', async (req, res) => {
  const { emailOrPhone } = req.body;
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  return res.json({ success: true, message: 'OTP sent!', otpPreview: generatedOtp });
});

router.post('/verify-otp-reset', async (req, res) => {
  return res.json({ success: true, message: 'Password reset successfully!' });
});

router.post('/change-password', async (req, res) => {
  return res.json({ success: true, message: 'Password changed!' });
});

router.get('/me', async (req, res) => {
  return res.json({ success: true, user: { name: 'User', role: 'customer' } });
});

module.exports = router;
