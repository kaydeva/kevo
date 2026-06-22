import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'xss-clean';
import { rateLimit } from 'express-rate-limit';
import pkg from 'express-validator';
const { body, validationResult } = pkg;
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 🛡️ SECURITY & UTILITY MIDDLEWARE
// ==========================================

// 1. Helmet: Secure HTTP headers (CSP is disabled to ensure React app assets and external CDNs like Google Fonts work seamlessly)
app.use(helmet({
  contentSecurityPolicy: false
}));

// 2. CORS: Restrict or allow origins
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// 3. Body Parser & limits
app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 4. Data Sanitization against XSS
app.use(xss());

// 5. Rate Limiting: Max 5 requests per minute per IP for email submission endpoints
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: { success: false, error: 'Too many requests, please try again after a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==========================================
// 📧 NODEMAILER CONFIGURATION
// ==========================================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: process.env.SMTP_SECURE !== 'false', 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.warn('⚠️ SMTP Configuration Warning: Ensure valid credentials are set in env.');
  } else {
    console.log('✅ SMTP Server is ready to send messages');
  }
});

// ==========================================
// 🚀 API ENDPOINTS
// ==========================================

// Validate inputs
const validateEnterpriseRequest = [
  body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail()
    .escape()
];

// Handles POST /enterprise-request and /api/enterprise-request
const handleEnterpriseRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const mailOptions = {
      from: `"Kevo Enterprise" <${process.env.SMTP_USER}>`,
      to: process.env.TO_EMAIL || 'kaydeva.godigital@gmail.com',
      subject: `New Enterprise Pilot Request: ${email}`,
      text: `A new organization has requested access to the Enterprise Pilot program.\n\nEmail: ${email}\nDate: ${new Date().toISOString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
          <h2 style="color: #0ea5e9;">New Enterprise Pilot Request</h2>
          <p>A new organization has requested access to the Kevo Enterprise Pilot program.</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Requested At:</strong> ${new Date().toISOString()}</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Request received successfully.' });
  } catch (error) {
    console.error('Email dispatch failed:', error.message);
    return res.status(500).json({ success: false, error: 'An internal server error occurred while processing your request.' });
  }
};

app.post('/enterprise-request', apiLimiter, validateEnterpriseRequest, handleEnterpriseRequest);
app.post('/api/enterprise-request', apiLimiter, validateEnterpriseRequest, handleEnterpriseRequest);

// ==========================================
// 🖥️ STATIC FILE SERVING (React dist folder)
// ==========================================

// Serve static assets from the React dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback: All other GET requests not handled by API routes serve index.html for React SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.message);
  res.status(500).json({ success: false, error: 'Critical server error.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Secure Monolithic Server running on port ${PORT}`);
  console.log(`📂 Serving frontend dist/ folder next to server.js`);
});
