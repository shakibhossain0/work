// Space Explorer Module using Three.js

// Initialize Three.js components
let scene, camera, renderer, controls;
let planets = [];
let stars = [];
let blackHoles = [];
let galaxies = [];

// DOM Elements
const spaceExplorer = document.getElementById('space-explorer');
const objectTypeSelector = document.getElementById('object-type');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const resetViewBtn = document.getElementById('reset-view');

// Initialize the space explorer
function initSpaceExplorer() {
    if (!spaceExplorer) return;
    
    // Set up Three.js scene
    setupScene();
    
    // Create space objects
    createSpaceObjects();
    
    // Set up controls
    setupControls();
    
    // Set up event listeners
    setupExplorerEventListeners();
    
    // Start animation loop
    animate();
}

// Set up Three.js scene
function setupScene() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a2a);
    scene.fog = new THREE.Fog(0x0a0a2a, 100, 1000);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
        75, 
        spaceExplorer.clientWidth / spaceExplorer.clientHeight, 
        0.1, 
        1000
    );
    camera.position.set(0, 0, 50);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(spaceExplorer.clientWidth, spaceExplorer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    spaceExplorer.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const sunLight = new THREE.PointLight(0xffffff, 1, 1000);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
    
    // Add stars background
    createStarfieldBackground();
}

// Create starfield background
function createStarfieldBackground() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.2,
        transparent: true,
        opacity: 0.8
    });
    
    const starVertices = [];
    for (let i = 0; i < 5000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }
    
    starGeometry.setAttribute(
        'position', 
        new THREE.Float32BufferAttribute(starVertices, 3)
    );
    
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
}

// Create space objects
function createSpaceObjects() {
    // Create planets
    createPlanets();
    
    // Create stars
    createStars();
    
    // Create black holes
    createBlackHoles();
    
    // Create galaxies
    createGalaxies();
    
    // Ensure all objects are visible by default
    [...planets, ...stars, ...blackHoles, ...galaxies].forEach(obj => {
        obj.visible = true;
    });
}

// Create planets
function createPlanets() {
    const planetData = [
        { name: 'Mercury', size: 1.5, color: 0x8a8a8a, distance: 10 },
        { name: 'Venus', size: 2.2, color: 0xe39e1c, distance: 15 },
        { name: 'Earth', size: 2.3, color: 0x1f77b4, distance: 20 },
        { name: 'Mars', size: 1.8, color: 0xff5555, distance: 25 },
        { name: 'Jupiter', size: 5.0, color: 0xd8ca9d, distance: 35 },
        { name: 'Saturn', size: 4.5, color: 0xf0e6a2, distance: 45 },
        { name: 'Uranus', size: 3.2, color: 0x4fd0e7, distance: 55 },
        { name: 'Neptune', size: 3.1, color: 0x3b5bdb, distance: 65 }
    ];
    
    planetData.forEach(data => {
        const geometry = new THREE.SphereGeometry(data.size, 32, 32);
        const material = new THREE.MeshPhongMaterial({ 
            color: data.color,
            shininess: 30
        });
        
        const planet = new THREE.Mesh(geometry, material);
        planet.position.x = data.distance;
        planet.name = data.name;
        
        // Add rotation animation
        planet.userData = { rotationSpeed: Math.random() * 0.01 + 0.005 };
        
        scene.add(planet);
        planets.push(planet);
    });
}

// Create stars
function createStars() {
    for (let i = 0; i < 50; i++) {
        const size = Math.random() * 3 + 1;
        const geometry = new THREE.SphereGeometry(size, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 0.5
        });
        
        const star = new THREE.Mesh(geometry, material);
        // Position stars closer to the center for better visibility
        star.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100
        );
        
        // Add pulsing animation
        star.userData = { 
            pulseSpeed: Math.random() * 0.02 + 0.01,
            baseSize: size
        };
        
        scene.add(star);
        stars.push(star);
    }
}

// Create black holes
function createBlackHoles() {
    for (let i = 0; i < 5; i++) {
        // Event horizon
        const horizonGeometry = new THREE.SphereGeometry(3, 32, 32);
        const horizonMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x000000,
            transparent: true,
            opacity: 0.8
        });
        
        const blackHole = new THREE.Mesh(horizonGeometry, horizonMaterial);
        blackHole.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100
        );
        
        // Accretion disk
        const diskGeometry = new THREE.RingGeometry(3.5, 7, 32);
        const diskMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff5500,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6
        });
        
        const accretionDisk = new THREE.Mesh(diskGeometry, diskMaterial);
        accretionDisk.rotation.x = Math.PI / 2;
        
        blackHole.add(accretionDisk);
        blackHole.name = `BlackHole${i+1}`;
        
        // Add rotation animation
        blackHole.userData = { rotationSpeed: Math.random() * 0.02 + 0.01 };
        
        scene.add(blackHole);
        blackHoles.push(blackHole);
    }
}

// Create galaxies
function createGalaxies() {
    for (let i = 0; i < 3; i++) {
        const galaxyGroup = new THREE.Group();
        
        // Create spiral arms
        const armCount = 4;
        const starsPerArm = 100;
        
        for (let arm = 0; arm < armCount; arm++) {
            const armGroup = new THREE.Group();
            
            for (let j = 0; j < starsPerArm; j++) {
                const distance = Math.random() * 30;
                const angle = (arm * Math.PI * 2 / armCount) + (j / starsPerArm) * Math.PI * 2;
                
                const geometry = new THREE.SphereGeometry(0.2, 8, 8);
                const material = new THREE.MeshBasicMaterial({ 
                    color: 0xffffff,
                    transparent: true,
                    opacity: Math.random() * 0.5 + 0.3
                });
                
                const star = new THREE.Mesh(geometry, material);
                star.position.set(
                    Math.cos(angle) * distance,
                    (Math.random() - 0.5) * 5,
                    Math.sin(angle) * distance
                );
                
                armGroup.add(star);
            }
            
            galaxyGroup.add(armGroup);
        }
        
        galaxyGroup.position.set(
            (Math.random() - 0.5) * 150,
            (Math.random() - 0.5) * 150,
            (Math.random() - 0.5) * 150
        );
        
        galaxyGroup.name = `Galaxy${i+1}`;
        galaxyGroup.userData = { rotationSpeed: Math.random() * 0.005 + 0.002 };
        
        scene.add(galaxyGroup);
        galaxies.push(galaxyGroup);
    }
}

// Set up controls
function setupControls() {
    // Zoom controls
    zoomInBtn.addEventListener('click', () => {
        camera.position.z -= 5;
    });
    
    zoomOutBtn.addEventListener('click', () => {
        camera.position.z += 5;
    });
    
    resetViewBtn.addEventListener('click', () => {
        camera.position.set(0, 0, 50);
        camera.lookAt(0, 0, 0);
    });
    
    // Object type selector
    objectTypeSelector.addEventListener('change', (e) => {
        const objectType = e.target.value;
        filterObjectsByType(objectType);
    });
}

// Filter objects by type
function filterObjectsByType(type) {
    // Hide all objects
    [...planets, ...stars, ...blackHoles, ...galaxies].forEach(obj => {
        obj.visible = false;
    });
    
    // Show selected type
    switch (type) {
        case 'planets':
            planets.forEach(planet => planet.visible = true);
            break;
        case 'stars':
            stars.forEach(star => star.visible = true);
            break;
        case 'blackholes':
            blackHoles.forEach(blackHole => blackHole.visible = true);
            break;
        case 'galaxies':
            galaxies.forEach(galaxy => galaxy.visible = true);
            break;
        default:
            // Show all
            [...planets, ...stars, ...blackHoles, ...galaxies].forEach(obj => {
                obj.visible = true;
            });
    }
    
    // Render the scene to immediately show changes
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Set up event listeners
function setupExplorerEventListeners() {
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Mouse controls for rotation and zooming
    let isDragging = false;
    let previousMousePosition = {
        x: 0,
        y: 0
    };
    
    // Touch controls for mobile
    let touchStartDistance = 0;
    
    // Mouse events
    spaceExplorer.addEventListener('mousedown', (e) => {
        isDragging = true;
    });
    
    spaceExplorer.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaMove = {
                x: e.offsetX - previousMousePosition.x,
                y: e.offsetY - previousMousePosition.y
            };
            
            // Rotate camera based on mouse movement
            camera.rotation.y += deltaMove.x * 0.01;
            camera.rotation.x += deltaMove.y * 0.01;
        }
        
        previousMousePosition = {
            x: e.offsetX,
            y: e.offsetY
        };
    });
    
    spaceExplorer.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    spaceExplorer.addEventListener('mouseleave', () => {
        isDragging = false;
    });
    
    // Mouse wheel zooming for PC
    spaceExplorer.addEventListener('wheel', (e) => {
        e.preventDefault();
        // Zoom in or out based on wheel direction
        camera.position.z += e.deltaY * 0.05;
        // Limit zoom range
        camera.position.z = Math.max(10, Math.min(200, camera.position.z));
    });
    
    // Touch events for mobile pinch zooming
    spaceExplorer.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            // Calculate initial distance between two touches
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            touchStartDistance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) +
                Math.pow(touch2.clientY - touch1.clientY, 2)
            );
        }
    });
    
    spaceExplorer.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            // Calculate current distance between two touches
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const currentDistance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) +
                Math.pow(touch2.clientY - touch1.clientY, 2)
            );
            
            // Calculate zoom amount based on distance change
            if (touchStartDistance > 0) {
                const distanceChange = touchStartDistance - currentDistance;
                camera.position.z += distanceChange * 0.1;
                // Limit zoom range
                camera.position.z = Math.max(10, Math.min(200, camera.position.z));
                touchStartDistance = currentDistance;
            }
        }
    });
    
    spaceExplorer.addEventListener('touchend', () => {
        touchStartDistance = 0;
    });
}

// Handle window resize
function onWindowResize() {
    if (!spaceExplorer) return;
    
    camera.aspect = spaceExplorer.clientWidth / spaceExplorer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(spaceExplorer.clientWidth, spaceExplorer.clientHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate planets
    planets.forEach(planet => {
        planet.rotation.y += planet.userData.rotationSpeed;
    });
    
    // Pulse stars
    stars.forEach(star => {
        const scale = 1 + Math.sin(Date.now() * star.userData.pulseSpeed) * 0.2;
        star.scale.set(scale, scale, scale);
    });
    
    // Rotate black holes
    blackHoles.forEach(blackHole => {
        blackHole.rotation.y += blackHole.userData.rotationSpeed;
    });
    
    // Rotate galaxies
    galaxies.forEach(galaxy => {
        galaxy.rotation.z += galaxy.userData.rotationSpeed;
    });
    
    // Render scene
    renderer.render(scene, camera);
}

// Initialize when called
function initializeSpaceExplorer() {
    // Check if already initialized
    if (window.spaceExplorerInitialized) return;
    
    // Initialize the space explorer
    initSpaceExplorer();
    window.spaceExplorerInitialized = true;
}

// Export for use in other modules
window.SpaceExplorer = {
    init: initSpaceExplorer
};
