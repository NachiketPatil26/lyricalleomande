// DOM Elements
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const bgContainer = document.getElementById('bg-container');
const mascotPlaceholder = document.getElementById('mascot-placeholder');
const mascotVideo = document.getElementById('mascot-video');
const mascotFestival = document.getElementById('mascot-festival');
const mascotAbout = document.getElementById('mascot-about');

// Mobile Menu Toggle
if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Close mobile menu if open
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust for fixed header
                behavior: 'smooth'
            });
        }
    });
});

// Three.js Sky Background
let scene, camera, renderer, sky, controls;
let mixer, clock;
let scrollY = 0;
let targetScrollY = 0;

// Initialize Three.js Scene
function initThreeJS() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000); // Increased far clipping plane
    camera.position.z = 5;
    camera.lookAt(scene.position); // Ensure camera looks at the origin
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    // Set renderer to have an opaque background
    renderer.setClearColor(0x000000, 1); // Opaque black background
    bgContainer.appendChild(renderer.domElement);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Increased intensity
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Increased intensity
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add hemisphere light for general illumination
    const hemisphereLight = new THREE.HemisphereLight(0xb1e1ff, 0xb97a20, 0.5); // Sky color, ground color, intensity
    scene.add(hemisphereLight);
    
    // Add controls for interactivity
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = false;
    
    // Initialize clock for animations
    clock = new THREE.Clock();
    
    // Load sky.glb model
    loadSkyModel();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Handle scroll events
    window.addEventListener('scroll', onScroll);
    
    // Start animation loop
    animate();
}

// Load the sky.glb model
function loadSkyModel() {
    const loader = new THREE.GLTFLoader();
    
    loader.load(
        'sky.glb',
        (gltf) => {
            console.log('sky.glb loaded successfully', gltf);
            sky = gltf.scene;
            
            // Scale and position the sky
            sky.scale.set(100, 100, 100); 
            
            // Adjust material properties for skybox
            sky.traverse((child) => {
                if (child.isMesh) {
                    // Ensure material is visible and depthWrite is false
                    child.material.visible = true;
                    child.material.depthWrite = false;
                    child.material.side = THREE.DoubleSide; // Render interior faces for skybox
                    
                    // Ensure material properties allow texture to be visible
                    // if (child.material.isMeshStandardMaterial) {
                        // child.material.color.set(0xffffff); // Ensure base color is not black if it affects texture visibility
                        // child.material.emissiveIntensity = 1; // Or ensure emissive map is used if available
                    // }
                    console.log('Material properties after potential adjustments:', child.material);
                    // Log specific material properties
                    console.log('Material color:', child.material.color);
                    console.log('Material emissive:', child.material.emissive);
                    console.log('Material opacity:', child.material.opacity);
                    console.log('Material transparent:', child.material.transparent);
                    console.log('Material map:', child.material.map);
                    console.log('Material emissiveMap:', child.material.emissiveMap);
                }
            });

            scene.add(sky);
            console.log('Sky model added to scene:', sky);
            
            // Check if the model has animations
            if (gltf.animations && gltf.animations.length) {
                mixer = new THREE.AnimationMixer(sky);
                
                // Play all animations
                gltf.animations.forEach((clip) => {
                    mixer.clipAction(clip).play();
                });
                console.log('Animations found and playing.');
            }
            
            // Add interactive elements to the sky
            addInteractiveElements();
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            console.error('An error happened while loading the model:', error);
            // Fallback: Set a simple background color if model fails to load
            renderer.setClearColor(0x000000, 1); // Set to opaque black or another color
            console.log('Setting fallback background color due to model loading error.');
        }
    );
}

// Add interactive elements to the sky
function addInteractiveElements() {
    // Add stars or particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Make particles interactive
    window.addEventListener('mousemove', (event) => {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        
        particlesMesh.rotation.x = mouseY * 0.1;
        particlesMesh.rotation.y = mouseX * 0.1;
    });
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Handle scroll events
function onScroll() {
    targetScrollY = window.scrollY;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Smooth scrolling effect
    scrollY += (targetScrollY - scrollY) * 0.05;
    
    // Rotate the sky based on scroll position
    if (sky) {
        sky.rotation.y = scrollY * 0.001;
        sky.rotation.x = scrollY * 0.0005;
    }
    
    // Update animation mixer
    if (mixer) {
        mixer.update(clock.getDelta());
    }
    
    // Update controls
    controls.update();
    
    // Render the scene
    renderer.render(scene, camera);
}

// Mascot Animation for Sections
function animateMascots() {
    // Add floating animation to mascot placeholders
    mascotPlaceholder.classList.add('animate-float');
    
    // Intersection Observer for section-specific animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target.id;
                
                switch(section) {
                    case 'videos':
                        mascotVideo.classList.add('animate-float');
                        break;
                    case 'festival':
                        mascotFestival.classList.add('animate-float');
                        break;
                    case 'about':
                        mascotAbout.classList.add('animate-float');
                        break;
                }
            }
        });
    }, { threshold: 0.3 });
    
    // Observe each section
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    animateMascots();
});