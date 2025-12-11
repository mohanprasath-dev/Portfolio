// Custom Cursor
const cursor = document.querySelector(".cursor");
if (cursor) {
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });
}

// Disable right-click
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();

  const message = document.querySelector(".right-click-message");
  if (message) {
    message.classList.add("show");

    setTimeout(() => {
      message.classList.remove("show");
    }, 3000);
  }
});

// Add hover effect to links and buttons
document.querySelectorAll("a, button, .project-card").forEach((element) => {
  element.addEventListener("mouseenter", () => {
    cursor.classList.add("hover");
  });

  element.addEventListener("mouseleave", () => {
    cursor.classList.remove("hover");
  });
});

// Add text hover effect to navigation links
document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("mouseenter", () => {
    cursor.classList.add("text-hover");
  });

  link.addEventListener("mouseleave", () => {
    cursor.classList.remove("text-hover");
  });
});

// Theme Toggle
const themeToggle = document.querySelector(".theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    // Change icon based on theme
    const icon = themeToggle.querySelector("i");
    if (icon) {
      if (document.body.classList.contains("light-mode")) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
      } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
      }
    }
  });
}

// Mobile Menu Toggle
const menuToggle = document.querySelector(".menu-toggle");
const closeMenu = document.querySelector(".close-menu");
const nav = document.querySelector("nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.add("active");
    document.body.style.overflow = "hidden";
  });
}

if (closeMenu && nav) {
  closeMenu.addEventListener("click", () => {
    nav.classList.remove("active");
    document.body.style.overflow = "auto";
  });
}

// Close menu when clicking on a link
if (nav) {
  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      document.body.style.overflow = "auto";
    });
  });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Three.js Scene
function initThreeScene() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas || typeof THREE === 'undefined') {
    console.warn('Three.js or canvas not available');
    return;
  }
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
  });
  
  // Set renderer to cover the entire window
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 5000;

  const posArray = new Float32Array(particlesCount * 3);
  const colorArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i += 3) {
    // Position
    posArray[i] = (Math.random() - 0.5) * 100;
    posArray[i + 1] = (Math.random() - 0.5) * 100;
    posArray[i + 2] = (Math.random() - 0.5) * 100;

    // Color
    colorArray[i] = Math.random();
    colorArray[i + 1] = Math.random();
    colorArray[i + 2] = Math.random();
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(posArray, 3)
  );
  particlesGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colorArray, 3)
  );

  // Material
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
  });

  // Points
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Torus geometry
  const torusGeometry = new THREE.TorusGeometry(4, 1, 16, 100);
  const torusMaterial = new THREE.MeshBasicMaterial({
    color: 0x6366f1,
    wireframe: true,
    transparent: true,
    opacity: 0.5,
  });
  const torus = new THREE.Mesh(torusGeometry, torusMaterial);
  scene.add(torus);

  // Camera position
  camera.position.z = 10;

  // Mouse movement
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener("mousemove", (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  // Animation
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Rotate torus
    torus.rotation.x = elapsedTime * 0.2;
    torus.rotation.y = elapsedTime * 0.2;

    // Move particles
    const positions = particlesGeometry.attributes.position.array;
    for (let i = 0; i < particlesCount * 3; i += 3) {
      positions[i] += Math.sin(elapsedTime + i) * 0.01;
      positions[i + 1] += Math.cos(elapsedTime + i) * 0.01;
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    // Move camera with mouse
    camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  // Handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
}

// Initialize Three.js scene
if (document.getElementById("hero-canvas")) {
  initThreeScene();
}

// Form submission
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  if (!submitButton) {
    console.error('Submit button not found');
  } else {
    const originalButtonText = submitButton.textContent;

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get form values
      const name = document.getElementById("name")?.value;
      const email = document.getElementById("email")?.value;
      const message = document.getElementById("message")?.value;

      if (!name || !email || !message) {
        showNotification('Please fill in all fields.', 'error');
        return;
      }

      // Disable button and show loading state
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
      submitButton.style.opacity = "0.7";

      try {
        // API endpoint - update this to match your server URL
        // For local development: 'http://localhost:3000/api/contact'
        // For production: 'https://your-domain.com/api/contact'
        const API_URL = 'http://localhost:3000/api/contact';
        
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            message,
          }),
        });

        // Check if response is ok before trying to parse JSON
        let data;
        try {
          data = await response.json();
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          showNotification('Server error. Please try again later.', 'error');
          return;
        }

        if (response.ok && data.success) {
          // Show success message
          showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
          contactForm.reset();
        } else {
          // Show error message
          showNotification(data.message || 'Failed to send message. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error:', error);
        
        // More specific error messages
        let errorMessage = 'Network error. ';
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage += 'Could not connect to server. Please make sure the server is running on http://localhost:3000';
        } else if (error.message.includes('CORS')) {
          errorMessage += 'CORS error. Please check server configuration.';
        } else {
          errorMessage += error.message || 'Please check your connection and try again.';
        }
        
        showNotification(errorMessage, 'error');
      } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        submitButton.style.opacity = "1";
      }
    });
  }
}

// Notification function
function showNotification(message, type = 'success') {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.form-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `form-notification ${type}`;
  notification.textContent = message;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    max-width: 400px;
  `;

  if (type === 'success') {
    notification.style.background = '#10b981';
  } else {
    notification.style.background = '#ef4444';
  }

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  // Remove notification after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      notification.remove();
      style.remove();
    }, 300);
  }, 5000);
}

// Add active class to navigation links on scroll
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav a");
  const header = document.querySelector("header");

  // Add scrolled class to header
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (scrollY >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").substring(1) === current) {
      link.classList.add("active");
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all sections for scroll animations
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    // Skip hero section (first section) - it should be visible immediately
    if (index === 0) {
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
    } else {
      section.style.opacity = '0';
      section.style.transform = 'translateY(30px)';
      section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(section);
    }
  });
});

