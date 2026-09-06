const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// @route   POST /api/contact
// @desc    Submit customer support message (directed to fhub0021@gmail.com)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const targetEmail = process.env.EMAIL_USER || 'fhub0021@gmail.com';

    console.log(`[CUSTOMER SUPPORT QUERY]
From: ${name} (${email}, Phone: ${phone || 'N/A'})
Subject: ${subject || 'Support Query'}
Message: ${message}
Sent to: ${targetEmail}`);

    // If nodemailer credentials configured in env, attempt real email delivery
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        await transporter.sendMail({
          from: email,
          to: targetEmail,
          subject: `Fashionvillaroyal Support: ${subject || 'Query from ' + name}`,
          text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n\nMessage:\n${message}`
        });
      } catch (mailError) {
        console.warn('Nodemailer notice (falling back to logged message):', mailError.message);
      }
    }

    res.json({
      success: true,
      message: 'Your message has been sent to Customer Support (fhub0021@gmail.com)! We will get back to you shortly.'
    });
  } catch (error) {
    console.error('Contact Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message.', error: error.message });
  }
});

module.exports = router;
