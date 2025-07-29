// Main JavaScript file for Cosmos Explorer

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const loadingProgress = document.querySelector('.loading-progress');
const mainNav = document.getElementById('main-nav');
const navLinks = document.querySelectorAll('.nav-link');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const sections = document.querySelectorAll('.section');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading progress
    simulateLoading();
    
    // Set up navigation
    setupNavigation();
    
    // Initialize 3D space environment
    initSpaceEnvironment();
    
    // Set up event listeners
    setupEventListeners();
});

// Simulate loading progress
function simulateLoading() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 500);
        }
        loadingProgress.style.width = `${progress}%`;
    }, 100);
}

// Set up navigation
function setupNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
            
            // Get target section
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
        // Show target section
        sections.forEach(section => section.classList.remove('active'));
        targetSection.classList.add('active');
        
        // Initialize space explorer when navigating to explore section
        if (targetId === 'explore') {
            // Small delay to ensure section is visible
            setTimeout(() => {
                if (typeof initializeSpaceExplorer === 'function') {
                    initializeSpaceExplorer();
                }
            }, 100);
        }
        
        // Initialize timeline when navigating to timeline section
        if (targetId === 'timeline') {
            // Small delay to ensure section is visible
            setTimeout(() => {
                if (typeof initializeTimeline === 'function') {
                    initializeTimeline();
                }
            }, 100);
        }
        
            
            // Scroll to top of section
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
}

// Initialize 3D space environment
function initSpaceEnvironment() {
    // This will be implemented with Three.js in space-explorer.js
    // For now, we'll create a simple starfield effect
    createStarfield();
}

// Create a simple starfield effect for the homepage
function createStarfield() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Add canvas to space-canvas element
    const spaceCanvas = document.getElementById('space-canvas');
    spaceCanvas.appendChild(canvas);
    
    // Create stars
    const stars = [];
    const starCount = 1000;
    
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.1,
            brightness: Math.random() * 0.5 + 0.5
        });
    }
    
    // Animation loop
    function animate() {
        // Clear canvas
        ctx.fillStyle = 'rgba(10, 10, 42, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw and update stars
        ctx.fillStyle = '#ffffff';
        stars.forEach(star => {
            // Update position
            star.x -= star.speed;
            
            // Reset star if it goes off screen
            if (star.x < 0) {
                star.x = canvas.width;
                star.y = Math.random() * canvas.height;
            }
            
            // Draw star
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    // Start animation
    animate();
}

// Set up event listeners
function setupEventListeners() {
    // Handle window resize
    window.addEventListener('resize', () => {
        // Reinitialize any components that need it
    });
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('light-mode');
            } else {
                document.body.classList.remove('light-mode');
            }
        });
    }
    
    // Language toggle functionality (Google Translate)
    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
        languageToggle.addEventListener('change', function() {
            if (this.checked) {
                // Switch to Bengali
                translatePage('bn');
            } else {
                // Switch to English
                translatePage('en');
            }
        });
    }
    
    // Footer form submissions
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert(`Thank you for subscribing with ${email}! You'll receive our next newsletter.`);
            this.reset();
        });
    }
    
    const feedbackForm = document.querySelector('.feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const feedback = this.querySelector('textarea').value;
            if (feedback.trim() !== '') {
                alert('Thank you for your feedback! We appreciate your input.');
                this.reset();
            } else {
                alert('Please enter your feedback before submitting.');
            }
        });
    }
}

// Google Translate function
function translatePage(lang) {
    try {
        // Use the global triggerTranslation function
        if (typeof window.triggerTranslation === 'function') {
            window.triggerTranslation(lang);
        } else {
            // Call the function directly from the global scope
            triggerTranslation(lang);
        }
    } catch (error) {
        console.log('Error triggering translation:', error);
    }
}

// Utility functions
function getRandomColor() {
    const colors = [
        '#00bfff', '#0088cc', '#0066cc', 
        '#ffcc00', '#ff9900', '#ff6600'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Export functions for use in other modules
window.CosmosExplorer = {
    getRandomColor,
    formatNumber
};
