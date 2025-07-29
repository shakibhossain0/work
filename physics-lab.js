// Zero Gravity Physics Lab Module

// DOM Elements
const physicsSimulator = document.getElementById('physics-simulator');
const objectSelector = document.getElementById('object-selector');
const forceSlider = document.getElementById('force-slider');
const applyForceBtn = document.getElementById('apply-force');

// Physics simulation variables
let scene, camera, renderer;
let objects = [];
let physicsWorld;
let clock = new THREE.Clock();

// Initialize physics lab
function initPhysicsLab() {
    if (!physicsSimulator) return;
    
    // Set up Three.js scene
    setupPhysicsScene();
    
    // Create physics world
    setupPhysicsWorld();
    
    // Create objects
    createPhysicsObjects();
    
    // Set up controls
    setupPhysicsControls();
    
    // Start simulation
    animatePhysics();
}

// Set up Three.js scene for physics lab
function setupPhysicsScene() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a2a);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
        75, 
        physicsSimulator.clientWidth / physicsSimulator.clientHeight, 
        0.1, 
        1000
    );
    camera.position.set(0, 0, 30);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(physicsSimulator.clientWidth, physicsSimulator.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    physicsSimulator.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add stars background
    createPhysicsStarfield();
}

// Create starfield for physics lab
function createPhysicsStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.8
    });
    
    const starVertices = [];
    for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 200;
        const z = (Math.random() - 0.5) * 200;
        starVertices.push(x, y, z);
    }
    
    starGeometry.setAttribute(
        'position', 
        new THREE.Float32BufferAttribute(starVertices, 3)
    );
    
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
}

// Set up physics world (simplified simulation)
function setupPhysicsWorld() {
    // In a real implementation, we would use a physics engine like Cannon.js or Ammo.js
    // For this demo, we'll simulate basic physics manually
    physicsWorld = {
        gravity: new THREE.Vector3(0, 0, 0), // Zero gravity environment
        objects: []
    };
}

// Create physics objects
function createPhysicsObjects() {
    // Create a bounding box for the simulation area
    const boxGeometry = new THREE.BoxGeometry(20, 20, 20);
    const boxMaterial = new THREE.MeshBasicMaterial({
        color: 0x00bfff,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    
    const boundingBox = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(boundingBox);
    
    // Create initial object based on selector
    createObject(objectSelector.value);
}

// Create a physics object
function createObject(type) {
    let geometry, material, mesh;
    
    switch (type) {
        case 'ball':
            geometry = new THREE.SphereGeometry(2, 32, 32);
            material = new THREE.MeshPhongMaterial({ 
                color: 0xff3333,
                shininess: 100
            });
            break;
        case 'cube':
            geometry = new THREE.BoxGeometry(3, 3, 3);
            material = new THREE.MeshPhongMaterial({ 
                color: 0x33ff33,
                shininess: 50
            });
            break;
        case 'liquid':
            geometry = new THREE.SphereGeometry(2, 16, 16);
            material = new THREE.MeshPhongMaterial({ 
                color: 0x3333ff,
                transparent: true,
                opacity: 0.7,
                shininess: 150
            });
            break;
        default:
            geometry = new THREE.SphereGeometry(2, 32, 32);
            material = new THREE.MeshPhongMaterial({ 
                color: 0xff3333,
                shininess: 100
            });
    }
    
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    
    // Add physics properties
    mesh.userData = {
        velocity: new THREE.Vector3(0, 0, 0),
        mass: type === 'liquid' ? 0.5 : 1,
        type: type,
        rotationSpeed: new THREE.Vector3(
            Math.random() * 0.02 - 0.01,
            Math.random() * 0.02 - 0.01,
            Math.random() * 0.02 - 0.01
        )
    };
    
    scene.add(mesh);
    objects.push(mesh);
    physicsWorld.objects.push(mesh);
}

// Set up physics controls
function setupPhysicsControls() {
    // Object selector
    objectSelector.addEventListener('change', (e) => {
        // Clear existing objects
        objects.forEach(obj => scene.remove(obj));
        objects = [];
        physicsWorld.objects = [];
        
        // Create new object
        createObject(e.target.value);
    });
    
    // Apply force button
    applyForceBtn.addEventListener('click', () => {
        applyForceToObjects();
    });
    
    // Handle window resize
    window.addEventListener('resize', onPhysicsResize);
}

// Apply force to objects
function applyForceToObjects() {
    const forceValue = forceSlider.value / 100;
    
    objects.forEach(obj => {
        // Apply random force direction
        const forceDirection = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize();
        
        // Apply force based on slider value
        const force = forceDirection.multiplyScalar(forceValue * 0.5);
        
        // Update velocity
        obj.userData.velocity.add(force);
    });
}

// Handle window resize for physics lab
function onPhysicsResize() {
    if (!physicsSimulator) return;
    
    camera.aspect = physicsSimulator.clientWidth / physicsSimulator.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(physicsSimulator.clientWidth, physicsSimulator.clientHeight);
}

// Physics simulation loop
function animatePhysics() {
    requestAnimationFrame(animatePhysics);
    
    const delta = clock.getDelta();
    
    // Update physics
    updatePhysics(delta);
    
    // Render scene
    renderer.render(scene, camera);
}

// Update physics simulation
function updatePhysics(delta) {
    // Update each object
    objects.forEach(obj => {
        // Update position based on velocity
        obj.position.add(obj.userData.velocity.clone().multiplyScalar(delta));
        
        // Update rotation
        obj.rotation.x += obj.userData.rotationSpeed.x;
        obj.rotation.y += obj.userData.rotationSpeed.y;
        obj.rotation.z += obj.userData.rotationSpeed.z;
        
        // Apply damping (simulate air resistance)
        obj.userData.velocity.multiplyScalar(0.98);
        
        // Boundary checking (bounce off walls)
        const bounds = 9;
        if (Math.abs(obj.position.x) > bounds) {
            obj.position.x = Math.sign(obj.position.x) * bounds;
            obj.userData.velocity.x *= -0.8; // Bounce with energy loss
        }
        
        if (Math.abs(obj.position.y) > bounds) {
            obj.position.y = Math.sign(obj.position.y) * bounds;
            obj.userData.velocity.y *= -0.8;
        }
        
        if (Math.abs(obj.position.z) > bounds) {
            obj.position.z = Math.sign(obj.position.z) * bounds;
            obj.userData.velocity.z *= -0.8;
        }
        
        // For liquid objects, add some deformation effect
        if (obj.userData.type === 'liquid') {
            const scale = 1 + Math.sin(Date.now() * 0.005) * 0.1;
            obj.scale.set(scale, scale, scale);
        }
    });
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the zero-gravity section to be visible
    const zeroGravitySection = document.getElementById('zero-gravity');
    if (zeroGravitySection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initPhysicsLab();
                    observer.disconnect();
                }
            });
        }, {
            threshold: 0.1
        });
        
        observer.observe(zeroGravitySection);
    }
});

// Export for use in other modules
window.PhysicsLab = {
    init: initPhysicsLab
};
