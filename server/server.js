const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// CORS configuration - allow requests from any origin (adjust for production)
app.use(cors({
  origin: '*', // In production, replace with your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting to prevent spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Configure nodemailer transporter (only if credentials are provided)
let transporter = null;
const hasEmailConfig = process.env.EMAIL_USER && process.env.EMAIL_PASS;

if (!hasEmailConfig) {
  console.warn('Warning: EMAIL_USER and EMAIL_PASS environment variables are not set.');
  console.warn('Email functionality is disabled. Form submissions will still be accepted but emails will not be sent.');
  console.warn('To enable email: Create a .env file with EMAIL_USER and EMAIL_PASS');
} else {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Verify transporter configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log('Email transporter error:', error.message);
      console.log('Form submissions will still work, but emails will not be sent.');
    } else {
      console.log('✓ Email transporter configured successfully');
    }
  });
}

// Contact form endpoint
app.post('/api/contact', limiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address',
      });
    }

    // Sanitize user input to prevent XSS
    const sanitize = (str) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    };

    const sanitizedName = sanitize(name);
    const sanitizedEmail = sanitize(email);
    const sanitizedMessage = sanitize(message).replace(/\n/g, '<br>');

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
      replyTo: email,
      subject: `Portfolio Contact Form: Message from ${sanitizedName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">New Contact Form Submission</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${sanitizedName}</p>
            <p><strong>Email:</strong> ${sanitizedEmail}</p>
            <p><strong>Message:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #6366f1;">
              ${sanitizedMessage}
            </p>
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">
            This email was sent from your portfolio contact form.
          </p>
        </div>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        
        Message:
        ${message}
      `,
    };

    // Send email (only if transporter is configured)
    if (transporter) {
      try {
        await transporter.sendMail(mailOptions);
        console.log(`✓ Contact form submission received from: ${sanitizedEmail}`);

        // Send confirmation email to user (optional)
        if (process.env.SEND_CONFIRMATION === 'true') {
          const confirmationMail = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting me!',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #6366f1;">Thank you for reaching out!</h2>
                <p>Hi ${sanitizedName},</p>
                <p>Thank you for contacting me through my portfolio. I have received your message and will get back to you as soon as possible.</p>
                <p>Best regards,<br>Mohan Prasath P</p>
              </div>
            `,
          };

          transporter.sendMail(confirmationMail).catch((err) => {
            console.error('Error sending confirmation email:', err.message);
          });
        }
      } catch (emailError) {
        console.error('Error sending email:', emailError.message);
        // Still return success to user even if email fails
        // In production, you might want to log this to a database instead
      }
    } else {
      // Log to console if email is not configured
      console.log('📧 Contact form submission (email disabled):');
      console.log(`   Name: ${sanitizedName}`);
      console.log(`   Email: ${sanitizedEmail}`);
      console.log(`   Message: ${message.substring(0, 100)}...`);
    }

    res.status(200).json({
      success: true,
      message: 'Message sent successfully!',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

