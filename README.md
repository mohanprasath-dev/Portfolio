# Portfolio Website

A modern, responsive portfolio website with contact form functionality.

## 📁 Project Structure

```
Portfolio/
├── public/                # Frontend files
│   ├── index.html         # Main portfolio page
│   ├── Projects.html      # Projects showcase page
│   ├── styles.css         # Main stylesheet
│   ├── Projects.css       # Projects page styles
│   ├── script.js          # Main JavaScript
│   └── Projects.js        # Projects page JavaScript
│
├── server/                # Backend files
│   └── server.js          # Express server for contact form
│
├── assets/                # Static assets
│   └── images/            # Image files
│       ├── mp1.png
│       ├── mp2.png
│       └── Photo.png
│
├── docs/                  # Documentation
│   ├── README.md          # Main documentation
│   └── README_BACKEND.md  # Backend setup guide
│
├── archive/                # Old/unused files
│   ├── 1.html
│   ├── 2.html
│   └── 3.html
│
├── package.json            # Node.js dependencies
├── .env                    # Environment variables (create this)
└── .gitignore              # Git ignore rules
```

## 📝 Features

- **Responsive Design**: Works on all devices
- **Modern UI**: Glassmorphism effects and smooth animations
- **Contact Form**: Backend integration with email notifications
- **3D Animations**: Three.js powered hero section
- **Dark/Light Mode**: Theme toggle functionality
- **Project Showcase**: Dedicated projects page with filtering

## 🛠️ Technologies

### Frontend
- HTML5
- CSS3 (with animations)
- JavaScript (ES6+)
- Three.js (3D graphics)

### Backend
- Node.js
- Express.js
- Nodemailer (email sending)
- Express Rate Limit (spam protection)

### File Paths
- All frontend files are in `public/`
- All backend files are in `server/`
- Images are in `assets/images/`
- Update paths accordingly when adding new files

### Adding New Pages
1. Create HTML file in `public/`
2. Create corresponding CSS/JS files
3. Update navigation links in `index.html`

## 📄 License

MIT License - Feel free to use this project for your portfolio!

## 👤 Author

**Mohan Prasath P**
- Email: mohanprasath210607@gmail.com
- LinkedIn: [mohanprasath21](https://www.linkedin.com/in/mohanprasath21)

---

**Note**: Remember to update the API URL in `public/script.js` when deploying to production!

