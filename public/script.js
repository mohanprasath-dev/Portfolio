// ========================================
// Page Loader
// ========================================
const pageLoader = document.getElementById('pageLoader');
window.addEventListener('load', () => {
  // Wait for the progress bar animation to complete
  setTimeout(() => {
    if (pageLoader) {
      pageLoader.classList.add('loaded');
    }
    // Trigger initial animations after page loads
    document.body.classList.add('page-loaded');
  }, 1800); // Extended to match progress bar animation
});

// ========================================
// Scroll Progress Indicator
// ========================================
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  
  // Update scroll progress bar
  if (scrollProgress) {
    scrollProgress.style.width = progress + '%';
  }
  
  // Show/hide back to top button
  if (backToTop) {
    if (scrollTop > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }
});

// Back to top click handler
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

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
document.querySelectorAll("a, button, .project-card, .island-pill").forEach((element) => {
  element.addEventListener("mouseenter", () => {
    cursor.classList.add("hover");
  });

  element.addEventListener("mouseleave", () => {
    cursor.classList.remove("hover");
  });
});

// Add text hover effect to navigation links (including Dynamic Island nav)
document.querySelectorAll("nav a, .island-nav a, .island-mobile-nav a").forEach((link) => {
  link.addEventListener("mouseenter", () => {
    cursor.classList.add("text-hover");
  });

  link.addEventListener("mouseleave", () => {
    cursor.classList.remove("text-hover");
  });
});

// ========================================
// Dynamic Island Navigation
// ========================================

const islandPill = document.querySelector('.island-pill');
const islandCollapsed = document.querySelector('.island-collapsed');
const islandClose = document.querySelector('.island-close');
const islandHeader = document.querySelector('.dynamic-island');

// Mobile Menu - Dynamic Island Expand/Collapse
function expandIsland() {
  if (window.innerWidth <= 768 && islandPill) {
    islandPill.classList.remove('menu-closing');
    islandPill.classList.add('menu-active');
    document.body.style.overflow = 'hidden';
  }
}

function collapseIsland() {
  if (islandPill && islandPill.classList.contains('menu-active')) {
    islandPill.classList.remove('menu-active');
    islandPill.classList.add('menu-closing');
    document.body.style.overflow = 'auto';
    
    // Remove closing class after animation
    setTimeout(() => {
      islandPill.classList.remove('menu-closing');
    }, 400);
  }
}

// Click on collapsed island to expand (mobile only)
if (islandCollapsed) {
  islandCollapsed.addEventListener('click', expandIsland);
}

// Click on pill itself when collapsed (mobile only)
if (islandPill) {
  islandPill.addEventListener('click', (e) => {
    // Only expand if clicking on the pill itself when collapsed
    if (window.innerWidth <= 768 && 
        !islandPill.classList.contains('menu-active') &&
        e.target === islandPill) {
      expandIsland();
    }
  });
}

// Close button
if (islandClose) {
  islandClose.addEventListener('click', (e) => {
    e.stopPropagation();
    collapseIsland();
  });
}

// Close menu when clicking on a link (mobile)
document.querySelectorAll('.island-mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    collapseIsland();
  });
});

// Active link highlighting
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY;
  
  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 150;
    const sectionId = section.getAttribute('id');
    
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      // Update desktop nav
      document.querySelectorAll('.island-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
      
      // Update mobile nav
      document.querySelectorAll('.island-mobile-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

// ========================================
// Navbar Auto-Hide on Scroll & Cursor Proximity
// ========================================

let lastScrollY = 0;
let isNavbarHidden = false;
let isMouseNearNav = false;
const navbarShowThreshold = 80; // pixels from top to trigger navbar show on mouse move

function showNavbar() {
  if (islandHeader && isNavbarHidden) {
    islandHeader.classList.remove('nav-hidden');
    islandHeader.classList.add('nav-visible');
    isNavbarHidden = false;
  }
}

function hideNavbar() {
  // Don't hide if mouse is near the navbar or menu is active
  if (islandHeader && !isNavbarHidden && !isMouseNearNav && 
      !(islandPill && islandPill.classList.contains('menu-active'))) {
    islandHeader.classList.remove('nav-visible');
    islandHeader.classList.add('nav-hidden');
    isNavbarHidden = true;
  }
}

// Track mouse position for cursor proximity detection
document.addEventListener('mousemove', (e) => {
  const mouseY = e.clientY;
  
  if (mouseY <= navbarShowThreshold) {
    isMouseNearNav = true;
    showNavbar();
  } else {
    isMouseNearNav = false;
    // If scrolled down and mouse moves away from nav area, hide it
    if (window.scrollY > 100 && lastScrollY <= window.scrollY) {
      hideNavbar();
    }
  }
});

// Handle scroll direction for auto-hide
function handleNavbarAutoHide() {
  const currentScrollY = window.scrollY;
  
  // Always show navbar at the top of the page
  if (currentScrollY <= 50) {
    showNavbar();
    lastScrollY = currentScrollY;
    return;
  }
  
  // Scrolling down - hide navbar (unless mouse is near)
  if (currentScrollY > lastScrollY && currentScrollY > 100 && !isMouseNearNav) {
    hideNavbar();
  }
  // Scrolling up - show navbar
  else if (currentScrollY < lastScrollY) {
    showNavbar();
  }
  
  lastScrollY = currentScrollY;
}

// Scrolled state for island
function handleIslandScroll() {
  if (islandHeader) {
    if (window.scrollY > 50) {
      islandHeader.classList.add('scrolled');
    } else {
      islandHeader.classList.remove('scrolled');
    }
  }
  updateActiveLink();
  handleNavbarAutoHide();
}

window.addEventListener('scroll', handleIslandScroll);

// Handle resize - collapse menu if resizing to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    collapseIsland();
  }
});

// ========================================
// Legacy Mobile Menu Toggle (kept for backwards compatibility)
// ========================================
const menuToggle = document.querySelector(".menu-toggle");
const closeMenu = document.querySelector(".close-menu");
const nav = document.querySelector("nav:not(.island-nav):not(.island-mobile-nav)");

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
  document.querySelectorAll("nav:not(.island-nav):not(.island-mobile-nav) a").forEach((link) => {
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

// Form submission (Formspree)
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
        // Formspree endpoint - get the action URL from the form
        const formAction = contactForm.getAttribute('action');
        
        const response = await fetch(formAction, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            message,
          }),
        });

        if (response.ok) {
          // Show success message
          showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
          contactForm.reset();
        } else {
          // Try to get error details
          let errorMsg = 'Failed to send message. Please try again.';
          try {
            const data = await response.json();
            if (data.errors) {
              errorMsg = data.errors.map(e => e.message).join(', ');
            }
          } catch (e) {}
          showNotification(errorMsg, 'error');
        }
      } catch (error) {
        console.error('Error:', error);
        showNotification('Network error. Please check your connection and try again.', 'error');
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

// ========================================
// Enhanced Smooth Scroll Animations
// ========================================

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Enhanced scroll reveal with stagger effects
document.addEventListener('DOMContentLoaded', () => {
  // Sections animation
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    if (index === 0) {
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
    } else {
      section.style.opacity = '0';
      section.style.transform = 'translateY(30px)';
      section.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      observer.observe(section);
    }
  });

  // Project cards staggered animation
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = `opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.15}s, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.15}s`;
    observer.observe(card);
  });

  // Skill items animation
  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    observer.observe(item);
  });

  // Timeline items animation
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `opacity 0.5s ease ${index * 0.15}s, transform 0.5s ease ${index * 0.15}s`;
    observer.observe(item);
  });

  // Feature items animation
  const featureItems = document.querySelectorAll('.feature-item');
  featureItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = `opacity 0.4s ease ${index * 0.1}s, transform 0.4s ease ${index * 0.1}s`;
    observer.observe(item);
  });

  // Tags animation
  const tags = document.querySelectorAll('.tag');
  tags.forEach((tag, index) => {
    tag.style.opacity = '0';
    tag.style.transform = 'scale(0.8)';
    tag.style.transition = `opacity 0.3s ease ${index * 0.05}s, transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${index * 0.05}s`;
    observer.observe(tag);
  });

  // Contact items animation
  const contactItems = document.querySelectorAll('.contact-item');
  contactItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    observer.observe(item);
  });

  // Social links animation
  const socialLinks = document.querySelectorAll('.social-link, .footer-social a');
  socialLinks.forEach((link, index) => {
    link.style.opacity = '0';
    link.style.transform = 'translateY(20px) scale(0.9)';
    link.style.transition = `opacity 0.4s ease ${index * 0.08}s, transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${index * 0.08}s`;
    observer.observe(link);
  });

  // Stats animation
  const stats = document.querySelectorAll('.stat-mini');
  stats.forEach((stat, index) => {
    stat.style.opacity = '0';
    stat.style.transform = 'scale(0.9)';
    stat.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${index * 0.1}s`;
    observer.observe(stat);
  });
});

// ========================================
// Smooth Scroll for Anchor Links
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ========================================
// Smooth Parallax Effect for Hero
// ========================================

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrolled = window.pageYOffset;
      const heroContent = document.querySelector('.hero-content');
      const scrollDown = document.querySelector('.scroll-down');
      
      if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
      }
      
      if (scrollDown && scrolled < window.innerHeight) {
        scrollDown.style.opacity = 1 - (scrolled / 200);
      }
      
      ticking = false;
    });
    ticking = true;
  }
});

// ========================================
// Smooth Number Counter Animation
// ========================================

function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  const suffix = element.textContent.includes('+') ? '+' : '';
  
  function updateCounter() {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start) + suffix;
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target + suffix;
    }
  }
  updateCounter();
}

// Trigger counter animation when stats are visible
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      entry.target.classList.add('counted');
      const numberEl = entry.target.querySelector('.stat-number-mini');
      if (numberEl) {
        const target = parseInt(numberEl.textContent);
        if (!isNaN(target)) {
          animateCounter(numberEl, target);
        }
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-mini').forEach(stat => {
  counterObserver.observe(stat);
});

// ========================================
// Smooth Skill Bar Animation
// ========================================

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const progress = entry.target.querySelector('.skill-progress');
      if (progress && !progress.classList.contains('animated')) {
        progress.classList.add('animated');
        const width = progress.style.width;
        progress.style.width = '0';
        setTimeout(() => {
          progress.style.transition = 'width 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          progress.style.width = width;
        }, 100);
      }
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-item').forEach(item => {
  skillObserver.observe(item);
});

// ========================================
// Enhanced Button Ripple Effect
// ========================================

document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple styles dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  .btn {
    position: relative;
    overflow: hidden;
  }
  .ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    transform: scale(0);
    animation: rippleAnimation 0.6s ease-out;
    pointer-events: none;
  }
  @keyframes rippleAnimation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyle);

// ========================================
// Smooth Card Hover Glow Effect
// ========================================

document.querySelectorAll('.project-card, .skills-column, .contact-form').forEach(card => {
  // Create glow element
  const glow = document.createElement('div');
  glow.classList.add('hover-glow');
  glow.style.cssText = `
    position: absolute;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
    transform: translate(-50%, -50%);
    z-index: 0;
  `;
  card.style.position = 'relative';
  card.style.overflow = 'hidden';
  card.appendChild(glow);
  
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    glow.style.left = x + 'px';
    glow.style.top = y + 'px';
    glow.style.opacity = '1';
  });
  
  card.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
});

// ========================================
// Smooth Page Transition Effect
// ========================================

// Add loading animation complete class
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  
  // Trigger hero animations
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '1';
    heroContent.style.transform = 'translateY(0)';
  }
});
