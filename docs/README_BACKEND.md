# Portfolio Backend Setup Guide

This guide will help you set up the backend server for the contact form.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- An email account (Gmail recommended)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create a `.env` file:**
   Create a `.env` file in the root directory with the following content:
   ```env
   PORT=3000
   NODE_ENV=development

   # Email Configuration
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # Receiver Email (where you want to receive contact form messages)
   RECEIVER_EMAIL=your-email@gmail.com

   # Optional: Send confirmation email to users
   SEND_CONFIRMATION=true
   ```

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password:**
   - Go to your Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in your `.env` file as `EMAIL_PASS`

## Other Email Services

You can use other email services by changing the `EMAIL_SERVICE` in your `.env` file:

- **Outlook/Hotmail:** `EMAIL_SERVICE=hotmail`
- **Yahoo:** `EMAIL_SERVICE=yahoo`
- **Custom SMTP:** Configure manually in `server.js`

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will run on `http://localhost:3000` by default.

## API Endpoints

### POST `/api/contact`
Submit contact form data.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'm interested in working with you!"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Message sent successfully!"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message here"
}
```

### GET `/api/health`
Health check endpoint.

## Frontend Configuration

Update the `API_URL` in `script.js` to point to your server:

```javascript
const API_URL = 'http://localhost:3000/api/contact';
```

For production, update it to your deployed server URL:
```javascript
const API_URL = 'https://your-domain.com/api/contact';
```

## Security Features

- **Rate Limiting:** Prevents spam (5 requests per 15 minutes per IP)
- **Input Validation:** Validates email format and required fields
- **CORS:** Configured for cross-origin requests

## Deployment

### Deploy to Heroku:
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Git

### Deploy to Vercel/Netlify:
Use serverless functions instead of a full Express server.

### Deploy to DigitalOcean/Railway:
Follow their Node.js deployment guides.

## Troubleshooting

**Email not sending:**
- Check your email credentials
- Verify app password is correct (for Gmail)
- Check spam folder
- Verify SMTP settings

**CORS errors:**
- Ensure your frontend URL is allowed in CORS settings
- Check server is running and accessible

**Rate limit errors:**
- Wait 15 minutes or adjust rate limit settings in `server.js`

## Support

For issues or questions, please contact: mohanprasath210607@gmail.com

