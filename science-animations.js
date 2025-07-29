// Science Animations Module

// DOM Elements
const scienceTopics = document.querySelectorAll('.science-topic');
const relativityCanvas = document.getElementById('relativity-animation');
const gravityCanvas = document.getElementById('gravity-animation');
const timeDilationCanvas = document.getElementById('time-dilation-animation');

// Canvas contexts
let relativityCtx, gravityCtx, timeDilationCtx;

// Animation states
let relativityAnimationId, gravityAnimationId, timeDilationAnimationId;

// Initialize science animations
function initScienceAnimations() {
    // Set up canvas contexts
    if (relativityCanvas) {
        relativityCtx = relativityCanvas.getContext('2d');
        setupCanvas(relativityCanvas, relativityCtx);
    }
    
    if (gravityCanvas) {
        gravityCtx = gravityCanvas.getContext('2d');
        setupCanvas(gravityCanvas, gravityCtx);
    }
    
    if (timeDilationCanvas) {
        timeDilationCtx = timeDilationCanvas.getContext('2d');
        setupCanvas(timeDilationCanvas, timeDilationCtx);
    }
    
    // Set up scroll-based animations
    setupScrollAnimations();
    
    // Start animations
    startRelativityAnimation();
    startGravityAnimation();
    startTimeDilationAnimation();
}

// Set up canvas
function setupCanvas(canvas, ctx) {
    if (!canvas) return;
    
    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Set up context
    ctx.fillStyle = '#0a0a2a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Set up scroll-based animations
function setupScrollAnimations() {
    // Create intersection observer for science topics
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.5
    });
    
    scienceTopics.forEach(topic => {
        observer.observe(topic);
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (relativityCanvas) {
            relativityCanvas.width = relativityCanvas.clientWidth;
            relativityCanvas.height = relativityCanvas.clientHeight;
        }
        
        if (gravityCanvas) {
            gravityCanvas.width = gravityCanvas.clientWidth;
            gravityCanvas.height = gravityCanvas.clientHeight;
        }
        
        if (timeDilationCanvas) {
            timeDilationCanvas.width = timeDilationCanvas.clientWidth;
            timeDilationCanvas.height = timeDilationCanvas.clientHeight;
        }
    });
}

// Relativity animation
function startRelativityAnimation() {
    if (!relativityCtx) return;
    
    let time = 0;
    
    function animate() {
        const canvas = relativityCanvas;
        const ctx = relativityCtx;
        
        if (!canvas || !ctx) return;
        
        // Clear canvas
        ctx.fillStyle = 'rgba(10, 10, 42, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw spacetime grid
        drawSpacetimeGrid(ctx, canvas.width, canvas.height, time);
        
        // Draw light cones
        drawLightCones(ctx, canvas.width, canvas.height, time);
        
        // Draw moving objects
        drawMovingObjects(ctx, canvas.width, canvas.height, time);
        
        time += 0.02;
        relativityAnimationId = requestAnimationFrame(animate);
    }
    
    animate();
}

// Draw spacetime grid
function drawSpacetimeGrid(ctx, width, height, time) {
    ctx.strokeStyle = 'rgba(0, 191, 255, 0.2)';
    ctx.lineWidth = 1;
    
    const gridSize = 30;
    const offsetX = Math.sin(time * 0.5) * 20;
    const offsetY = Math.cos(time * 0.3) * 15;
    
    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x + offsetX, 0);
        ctx.lineTo(x - offsetX, height);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y + offsetY);
        ctx.lineTo(width, y - offsetY);
        ctx.stroke();
    }
}

// Draw light cones
function drawLightCones(ctx, width, height, time) {
    ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
    ctx.lineWidth = 2;
    
    const centerX = width / 2;
    const centerY = height / 2;
    const coneHeight = Math.min(width, height) * 0.4;
    
    // Future light cone
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - coneHeight, centerY + coneHeight);
    ctx.lineTo(centerX + coneHeight, centerY + coneHeight);
    ctx.lineTo(centerX, centerY);
    ctx.stroke();
    
    // Past light cone
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - coneHeight, centerY - coneHeight);
    ctx.lineTo(centerX + coneHeight, centerY - coneHeight);
    ctx.lineTo(centerX, centerY);
    ctx.stroke();
    
    // Moving source
    const sourceX = centerX + Math.sin(time * 2) * 50;
    const sourceY = centerY + Math.cos(time * 1.5) * 30;
    
    ctx.fillStyle = '#00bfff';
    ctx.beginPath();
    ctx.arc(sourceX, sourceY, 5, 0, Math.PI * 2);
    ctx.fill();
}

// Draw moving objects
function drawMovingObjects(ctx, width, height, time) {
    // Draw multiple objects moving at different speeds
    for (let i = 0; i < 5; i++) {
        const speed = 0.2 + i * 0.1;
        const x = (time * speed * 50) % (width + 100) - 50;
        const y = height / 2 + Math.sin(time * speed + i) * 30;
        const size = 3 + i * 2;
        
        ctx.fillStyle = `hsl(${200 + i * 30}, 100%, 70%)`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Gravity animation
function startGravityAnimation() {
    if (!gravityCtx) return;
    
    let time = 0;
    
    function animate() {
        const canvas = gravityCanvas;
        const ctx = gravityCtx;
        
        if (!canvas || !ctx) return;
        
        // Clear canvas
        ctx.fillStyle = 'rgba(10, 10, 42, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw gravitational field
        drawGravitationalField(ctx, canvas.width, canvas.height, time);
        
        // Draw orbiting objects
        drawOrbitingObjects(ctx, canvas.width, canvas.height, time);
        
        time += 0.02;
        gravityAnimationId = requestAnimationFrame(animate);
    }
    
    animate();
}

// Draw gravitational field
function drawGravitationalField(ctx, width, height, time) {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.4;
    
    // Draw concentric circles representing gravitational potential
    ctx.strokeStyle = 'rgba(0, 191, 255, 0.1)';
    ctx.lineWidth = 1;
    
    for (let r = 20; r < maxRadius; r += 20) {
        const distortion = Math.sin(time * 2 + r * 0.1) * 5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r + distortion, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Draw central mass
    const massSize = 20 + Math.sin(time * 3) * 5;
    const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, massSize
    );
    gradient.addColorStop(0, '#ff9900');
    gradient.addColorStop(1, '#ff3300');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, massSize, 0, Math.PI * 2);
    ctx.fill();
}

// Draw orbiting objects
function drawOrbitingObjects(ctx, width, height, time) {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw multiple orbiting objects
    for (let i = 0; i < 4; i++) {
        const orbitRadius = 50 + i * 40;
        const angle = time * (0.5 + i * 0.2) + i;
        const x = centerX + Math.cos(angle) * orbitRadius;
        const y = centerY + Math.sin(angle) * orbitRadius;
        const size = 3 + i * 2;
        
        ctx.fillStyle = `hsl(${60 + i * 60}, 100%, 70%)`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Time dilation animation
function startTimeDilationAnimation() {
    if (!timeDilationCtx) return;
    
    let time = 0;
    
    function animate() {
        const canvas = timeDilationCanvas;
        const ctx = timeDilationCtx;
        
        if (!canvas || !ctx) return;
        
        // Clear canvas
        ctx.fillStyle = 'rgba(10, 10, 42, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw time dilation visualization
        drawTimeDilation(ctx, canvas.width, canvas.height, time);
        
        time += 0.02;
        timeDilationAnimationId = requestAnimationFrame(animate);
    }
    
    animate();
}

// Draw time dilation visualization
function drawTimeDilation(ctx, width, height, time) {
    const centerY = height / 2;
    
    // Draw two timelines
    const slowTimelineY = centerY - 50;
    const fastTimelineY = centerY + 50;
    
    // Draw timeline lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(0, slowTimelineY);
    ctx.lineTo(width, slowTimelineY);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, fastTimelineY);
    ctx.lineTo(width, fastTimelineY);
    ctx.stroke();
    
    // Draw time markers
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    for (let i = 0; i < 10; i++) {
        const x = (i + 1) * (width / 11);
        
        // Slow timeline markers (closer together)
        const slowX = x - Math.sin(time + i * 0.5) * 10;
        ctx.beginPath();
        ctx.moveTo(slowX, slowTimelineY - 10);
        ctx.lineTo(slowX, slowTimelineY + 10);
        ctx.stroke();
        
        if (i % 2 === 0) {
            ctx.fillText(`t${i}`, slowX, slowTimelineY - 20);
        }
        
        // Fast timeline markers (further apart)
        const fastX = x + Math.sin(time + i * 0.5) * 10;
        ctx.beginPath();
        ctx.moveTo(fastX, fastTimelineY - 10);
        ctx.lineTo(fastX, fastTimelineY + 10);
        ctx.stroke();
        
        if (i % 2 === 0) {
            ctx.fillText(`t${i}`, fastX, fastTimelineY + 30);
        }
    }
    
    // Draw connecting lines to show time difference
    ctx.strokeStyle = 'rgba(0, 191, 255, 0.5)';
    ctx.setLineDash([5, 5]);
    
    for (let i = 0; i < 10; i += 2) {
        const x = (i + 1) * (width / 11);
        const slowX = x - Math.sin(time + i * 0.5) * 10;
        const fastX = x + Math.sin(time + i * 0.5) * 10;
        
        ctx.beginPath();
        ctx.moveTo(slowX, slowTimelineY);
        ctx.lineTo(fastX, fastTimelineY);
        ctx.stroke();
    }
    
    ctx.setLineDash([]);
    
    // Draw labels
    ctx.fillStyle = '#00bfff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Slow Time (Strong Gravity)', 20, slowTimelineY - 30);
    ctx.fillText('Fast Time (Weak Gravity)', 20, fastTimelineY + 45);
}

// Stop all animations
function stopScienceAnimations() {
    if (relativityAnimationId) {
        cancelAnimationFrame(relativityAnimationId);
    }
    
    if (gravityAnimationId) {
        cancelAnimationFrame(gravityAnimationId);
    }
    
    if (timeDilationAnimationId) {
        cancelAnimationFrame(timeDilationAnimationId);
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the science section to be visible
    const scienceSection = document.getElementById('science');
    if (scienceSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initScienceAnimations();
                    observer.disconnect();
                }
            });
        }, {
            threshold: 0.1
        });
        
        observer.observe(scienceSection);
    }
});

// Export for use in other modules
window.ScienceAnimations = {
    init: initScienceAnimations,
    stop: stopScienceAnimations
};
