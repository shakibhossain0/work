// Cosmic Timeline Module

// DOM Elements
const timelineViewer = document.getElementById('timeline-viewer');
const timelineSlider = document.getElementById('timeline-slider');
const timelinePlayBtn = document.getElementById('timeline-play');
const timelinePauseBtn = document.getElementById('timeline-pause');

// Timeline data (excluding Agriculture, Industrial, Humans, Dinosaurs, Degenerate, Black Hole, and Heat Death events as requested)
const timelineData = [
    { 
        time: -13800000000, 
        label: "Big Bang", 
        description: "The beginning of space and time",
        color: "#ff9900",
        size: 20
    },
    { 
        time: -13000000000, 
        label: "First Stars", 
        description: "Formation of the first stellar objects",
        color: "#ffff00",
        size: 12
    },
    { 
        time: -12000000000, 
        label: "First Galaxies", 
        description: "Formation of early galaxies",
        color: "#00bfff",
        size: 15
    },
    { 
        time: -10000000000, 
        label: "Reionization", 
        description: "The universe becomes transparent to light",
        color: "#ff5555",
        size: 10
    },
    { 
        time: -5000000000, 
        label: "Solar System", 
        description: "Formation of our solar system",
        color: "#1f77b4",
        size: 14
    },
    { 
        time: -3500000000, 
        label: "Life on Earth", 
        description: "First emergence of life",
        color: "#00cc66",
        size: 12
    },
    { 
        time: -500000000, 
        label: "Cambrian", 
        description: "Explosion of complex life forms",
        color: "#00cc66",
        size: 10
    },
    { 
        time: 0, 
        label: "Present", 
        description: "Current time",
        color: "#ffffff",
        size: 10
    },
    { 
        time: 1000000000, 
        label: "Sun Red Giant", 
        description: "The Sun becomes a red giant",
        color: "#ff5555",
        size: 14
    },
    { 
        time: 5000000000, 
        label: "Sun Dies", 
        description: "The Sun exhausts its fuel",
        color: "#880000",
        size: 12
    },
    { 
        time: 100000000000, 
        label: "Stelliferous", 
        description: "End of star formation era",
        color: "#666666",
        size: 10
    }
];

// Timeline variables
let timelineCtx;
let isPlaying = false;
let animationId;
let currentTime = 0;

// Initialize timeline
function initTimeline() {
    if (!timelineViewer) {
        return;
    }
    
    // Set up canvas
    setupTimelineCanvas();
    
    // Set up controls
    setupTimelineControls();
    
    // Draw initial timeline
    drawTimeline();
}

// Set up timeline canvas
function setupTimelineCanvas() {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'timeline-canvas';
    
    // Set canvas dimensions to match container
    canvas.width = timelineViewer.clientWidth || 800;
    canvas.height = timelineViewer.clientHeight || 500;
    
    // Clear the container and add canvas
    timelineViewer.innerHTML = '';
    timelineViewer.appendChild(canvas);
    
    // Get 2D context
    timelineCtx = canvas.getContext('2d');
    
    if (!timelineCtx) {
        return;
    }
    
    // Set up context
    timelineCtx.fillStyle = '#0a0a2a';
    timelineCtx.fillRect(0, 0, canvas.width, canvas.height);
}

// Set up timeline controls
function setupTimelineControls() {
    // Slider control
    timelineSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        currentTime = mapValueToTime(value);
        drawTimeline();
    });
    
    // Play button
    timelinePlayBtn.addEventListener('click', () => {
        isPlaying = true;
        playTimeline();
    });
    
    // Pause button
    timelinePauseBtn.addEventListener('click', () => {
        isPlaying = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const canvas = document.getElementById('timeline-canvas');
        if (canvas) {
            canvas.width = timelineViewer.clientWidth;
            canvas.height = timelineViewer.clientHeight;
        }
        drawTimeline();
    });
}

// Play timeline animation
function playTimeline() {
    if (!isPlaying) return;
    
    // Update current time
    currentTime += 100000000; // Move forward 100 million years per frame
    
    // Check if we've reached the end
    if (currentTime > timelineData[timelineData.length - 1].time) {
        currentTime = timelineData[0].time;
    }
    
    // Update slider
    const sliderValue = mapTimeToValue(currentTime);
    timelineSlider.value = sliderValue;
    
    // Draw timeline
    drawTimeline();
    
    // Continue animation
    animationId = requestAnimationFrame(playTimeline);
}

// Draw timeline
function drawTimeline() {
    if (!timelineCtx) {
        return;
    }
    
    // Get the canvas element
    const canvas = document.getElementById('timeline-canvas');
    if (!canvas) {
        return;
    }
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    timelineCtx.fillStyle = '#0a0a2a';
    timelineCtx.fillRect(0, 0, width, height);
    
    // Draw timeline axis
    const axisY = height / 2;
    timelineCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    timelineCtx.lineWidth = 2;
    timelineCtx.beginPath();
    timelineCtx.moveTo(50, axisY);
    timelineCtx.lineTo(width - 50, axisY);
    timelineCtx.stroke();
    
    // Draw time markers
    drawTimeMarkers(width, height, axisY);
    
    // Draw timeline events
    drawTimelineEvents(width, height, axisY);
    
    // Draw current time indicator
    drawCurrentTimeIndicator(width, height, axisY);
}

// Draw time markers
function drawTimeMarkers(width, height, axisY) {
    timelineCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    timelineCtx.font = '12px Arial';
    timelineCtx.textAlign = 'center';
    
    // Draw major time markers (excluding the ones requested to be removed)
    const timePoints = [
        { time: 0, label: "Now" }
    ];
    
    timePoints.forEach(point => {
        // Use adjusted positions for consistency
        const x = getAdjustedX(point.time, width);
        if (x >= 50 && x <= width - 50) {
            // Draw tick mark
            timelineCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            timelineCtx.lineWidth = 1;
            timelineCtx.beginPath();
            timelineCtx.moveTo(x, axisY - 10);
            timelineCtx.lineTo(x, axisY + 10);
            timelineCtx.stroke();
            
            // Draw label
            timelineCtx.fillText(point.label, x, axisY + 30);
        }
    });
}

// Keep track of label positions to prevent overlap
let labelPositions = [];

// Draw timeline events
function drawTimelineEvents(width, height, axisY) {
    // Reset label positions for each draw
    labelPositions = [];
    
    timelineData.forEach((event, index) => {
        const originalX = mapTimeToX(event.time, width);
        const x = getAdjustedX(event.time, width);
        const y = axisY;
        
        // Only draw if within visible range
        if (x >= 0 && x <= width) {
            // Draw event marker
            timelineCtx.fillStyle = event.color;
            timelineCtx.beginPath();
            timelineCtx.arc(x, y, event.size, 0, Math.PI * 2);
            timelineCtx.fill();
            
            // Draw glow effect
            const gradient = timelineCtx.createRadialGradient(
                x, y, event.size,
                x, y, event.size * 2
            );
            gradient.addColorStop(0, event.color);
            gradient.addColorStop(1, 'transparent');
            
            timelineCtx.fillStyle = gradient;
            timelineCtx.beginPath();
            timelineCtx.arc(x, y, event.size * 2, 0, Math.PI * 2);
            timelineCtx.fill();
            
            // Draw event label with alternating positions and collision detection
            drawEventLabel(event, x, y, index);
        }
    });
}

// Draw event label with alternating positions and collision detection
function drawEventLabel(event, x, y, index) {
    timelineCtx.font = '12px Arial';
    timelineCtx.textAlign = 'center';
    
    // Measure text width to help with positioning
    const textMetrics = timelineCtx.measureText(event.label);
    const textWidth = textMetrics.width;
    const textHeight = 12; // Approximate height for 12px font
    
    // Alternate between placing labels below (even indices) and above (odd indices) the markers
    let labelX = x;
    const isEvenIndex = index % 2 === 0;
    let labelY = isEvenIndex ? y + event.size + 25 : y - event.size - 15;
    
    // Check for collisions with existing labels and adjust position
    let collision = true;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (collision && attempts < maxAttempts) {
        collision = false;
        
        // Check against all existing label positions
        for (const pos of labelPositions) {
            // Simple collision detection - check if bounding boxes overlap
            if (Math.abs(labelX - pos.x) < (textWidth / 2 + pos.width / 2 + 15) &&
                Math.abs(labelY - pos.y) < (textHeight / 2 + pos.height / 2 + 15)) {
                collision = true;
                break;
            }
        }
        
        if (collision) {
            // Try a different position
            if (attempts % 4 === 0) {
                // Try offset to the left
                labelX = x - 20 - (attempts * 5);
            } else if (attempts % 4 === 1) {
                // Try offset to the right
                labelX = x + 20 + (attempts * 5);
            } else if (attempts % 4 === 2) {
                // Try the opposite vertical position
                labelY = isEvenIndex ? y - event.size - 15 : y + event.size + 25;
            } else {
                // Try further offset
                labelX = x + (attempts > 4 ? -30 : 30) * Math.floor(attempts / 4);
            }
            attempts++;
        }
    }
    
    // If we still have a collision, we'll draw it anyway but with reduced opacity
    // to indicate the overlap
    if (collision) {
        timelineCtx.globalAlpha = 0.7;
    }
    
    // Draw label with outline for better visibility
    timelineCtx.lineWidth = 3;
    timelineCtx.strokeStyle = '#000000'; // Black outline
    timelineCtx.strokeText(event.label, labelX, labelY);
    timelineCtx.fillStyle = '#ffffff'; // White text
    timelineCtx.fillText(event.label, labelX, labelY);
    
    // Reset opacity
    timelineCtx.globalAlpha = 1.0;
    
    // Store position to prevent future collisions
    labelPositions.push({
        x: labelX,
        y: labelY,
        width: textWidth,
        height: textHeight
    });
}

// Draw current time indicator
function drawCurrentTimeIndicator(width, height, axisY) {
    const x = getAdjustedX(currentTime, width);
    
    // Draw indicator line
    timelineCtx.strokeStyle = '#00bfff';
    timelineCtx.lineWidth = 3;
    timelineCtx.setLineDash([5, 5]);
    timelineCtx.beginPath();
    timelineCtx.moveTo(x, 0);
    timelineCtx.lineTo(x, height);
    timelineCtx.stroke();
    timelineCtx.setLineDash([]);
    
    // Draw indicator label
    timelineCtx.fillStyle = '#00bfff';
    timelineCtx.font = '16px Arial';
    timelineCtx.textAlign = 'center';
    
    // Format current time for display
    const timeLabel = formatTimeForDisplay(currentTime);
    timelineCtx.fillText(timeLabel, x, 30);
    
    // Draw description of current era
    const currentEvent = getCurrentEvent();
    if (currentEvent) {
        timelineCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        timelineCtx.font = '14px Arial';
        timelineCtx.fillText(currentEvent.description, x, height - 30);
    }
}

// Cache for storing calculated positions to avoid recalculation
let positionCache = new Map();

// Map time to X coordinate with minimum spacing
function mapTimeToX(time, width) {
    // Check if we have a cached position
    const cacheKey = `${time}-${width}`;
    if (positionCache.has(cacheKey)) {
        return positionCache.get(cacheKey);
    }
    
    // Logarithmic scale for better visualization
    const minTime = timelineData[0].time;
    const maxTime = timelineData[timelineData.length - 1].time;
    
    // Handle negative and positive times separately for log scale
    let calculatedX;
    if (time < 0) {
        const logMin = Math.log(-minTime);
        const logTime = Math.log(-Math.min(time, -1)); // Avoid log(0)
        const ratio = (logMin - logTime) / (logMin - Math.log(1));
        calculatedX = 50 + ratio * (width - 100) / 2;
    } else if (time > 0) {
        const logMax = Math.log(maxTime);
        const logTime = Math.log(Math.max(time, 1)); // Avoid log(0)
        const ratio = logTime / logMax;
        calculatedX = 50 + (width - 100) / 2 + ratio * (width - 100) / 2;
    } else {
        calculatedX = width / 2;
    }
    
    // Cache the calculated position
    positionCache.set(cacheKey, calculatedX);
    return calculatedX;
}

// Adjust positions to ensure minimum spacing between elements
function adjustPositionsForSpacing(width) {
    // Get all positions
    const positions = timelineData.map(event => ({
        time: event.time,
        originalX: mapTimeToX(event.time, width),
        event: event
    }));
    
    // Sort by original X position
    positions.sort((a, b) => a.originalX - b.originalX);
    
    // Ensure minimum spacing
    const minSpacing = 60; // Minimum pixels between elements
    for (let i = 1; i < positions.length; i++) {
        const prevPos = positions[i - 1];
        const currentPos = positions[i];
        
        // If current element is too close to previous, move it
        if (currentPos.originalX - prevPos.originalX < minSpacing) {
            currentPos.adjustedX = prevPos.adjustedX ? 
                prevPos.adjustedX + minSpacing : 
                prevPos.originalX + minSpacing;
        } else {
            currentPos.adjustedX = currentPos.originalX;
        }
    }
    
    // First element keeps its original position
    positions[0].adjustedX = positions[0].originalX;
    
    return positions;
}

// Get adjusted X position for an event
function getAdjustedX(time, width) {
    const adjustedPositions = adjustPositionsForSpacing(width);
    const position = adjustedPositions.find(pos => pos.time === time);
    return position ? position.adjustedX : mapTimeToX(time, width);
}

// Map X coordinate to time
function mapXToTime(x, width) {
    // For the slider, we need to map the adjusted position back to time
    // We'll use a simplified linear mapping based on the adjusted positions
    const adjustedPositions = adjustPositionsForSpacing(width);
    
    // Find the two closest positions
    let prevPos = adjustedPositions[0];
    let nextPos = adjustedPositions[adjustedPositions.length - 1];
    
    for (let i = 0; i < adjustedPositions.length - 1; i++) {
        if (adjustedPositions[i].adjustedX <= x && adjustedPositions[i + 1].adjustedX >= x) {
            prevPos = adjustedPositions[i];
            nextPos = adjustedPositions[i + 1];
            break;
        }
    }
    
    // Linear interpolation between the two positions
    const ratio = (x - prevPos.adjustedX) / (nextPos.adjustedX - prevPos.adjustedX);
    return prevPos.time + ratio * (nextPos.time - prevPos.time);
}

// Map slider value to time
function mapValueToTime(value) {
    const minTime = timelineData[0].time;
    const maxTime = timelineData[timelineData.length - 1].time;
    return minTime + (value / 100) * (maxTime - minTime);
}

// Map time to slider value
function mapTimeToValue(time) {
    const minTime = timelineData[0].time;
    const maxTime = timelineData[timelineData.length - 1].time;
    return ((time - minTime) / (maxTime - minTime)) * 100;
}

// Format time for display
function formatTimeForDisplay(time) {
    if (time < -1000000000) {
        return `${(time / 1000000000).toFixed(1)} BYA`;
    } else if (time < -1000000) {
        return `${(time / 1000000).toFixed(1)} MYA`;
    } else if (time < -1000) {
        return `${(time / 1000).toFixed(1)} KYA`;
    } else if (time < 0) {
        return `${Math.abs(time)} years ago`;
    } else if (time > 1000000000000) {
        return `${(time / 1000000000000).toFixed(1)} TY`;
    } else if (time > 1000000000) {
        return `${(time / 1000000000).toFixed(1)} BY`;
    } else if (time > 1000000) {
        return `${(time / 1000000).toFixed(1)} MY`;
    } else if (time > 1000) {
        return `${(time / 1000).toFixed(1)} KY`;
    } else {
        return `${time} years`;
    }
}

// Get current event based on time
function getCurrentEvent() {
    // Find the event closest to current time
    let closestEvent = timelineData[0];
    let minDistance = Math.abs(currentTime - closestEvent.time);
    
    for (let i = 1; i < timelineData.length; i++) {
        const distance = Math.abs(currentTime - timelineData[i].time);
        if (distance < minDistance) {
            minDistance = distance;
            closestEvent = timelineData[i];
        }
    }
    
    return closestEvent;
}

// Initialize when called
function initializeTimeline() {
    // Check if already initialized
    if (window.timelineInitialized) return;
    
    // Initialize the timeline
    initTimeline();
    window.timelineInitialized = true;
}

// Export for use in other modules
window.CosmicTimeline = {
    init: initTimeline
};
