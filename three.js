import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';

// Removed getting the container element here, as the canvas will cover the window
// const container = document.getElementById('container3D');

const camera = new THREE.PerspectiveCamera(
    80, // Keep FOV at 75 unless a different value is preferred
    // Use window aspect ratio again
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 13; // Reverted camera Z position

const scene = new THREE.Scene();
let bee;
let modelGroup;
let mixer;
const loader = new GLTFLoader();
loader.load('./lemon.glb',
    function (gltf) {
        bee = gltf.scene;
        
        modelGroup = new THREE.Group();
        modelGroup.add(bee);
        scene.add(modelGroup);

        console.log('lemon.glb loaded successfully!', gltf);
        console.log('Model loaded into group:', modelGroup);

        if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(bee);
            mixer.clipAction(gltf.animations[0]).play();
        } else {
            console.log('Model has no animations.');
        }
        
        modelGroup.position.set(6, 0, 0);
        modelGroup.rotation.set(0, 6, 0);
        modelGroup.scale.set(8, 8, 8);
    },
    function (xhr) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function (error) {
        console.error( 'An error occurred while loading the model:', error );
    }
);
const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
// Set initial renderer size based on container
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor( 0x000000, 0 ); // Ensure transparency
document.getElementById('container3D').appendChild(renderer.domElement);

// light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3); // Reduced ambient light intensity
scene.add(ambientLight);

// const topLight = new THREE.DirectionalLight(0xffffff, 0.25); // Increased directional light intensity significantly
// topLight.position.set(750, 750, 750); // Adjusted directional light position (e.g., top-right-front)
// scene.add(topLight);

const bottomLight = new THREE.DirectionalLight(0xffffff, 0.1); // You can adjust intensity as needed
bottomLight.position.set(-250, -500, 1200); // Below and in front of the object
scene.add(bottomLight);



// // Bring back AxesHelper for debugging
// const axesHelper = new THREE.AxesHelper( 5 ); // Size 5
// scene.add( axesHelper );

// Removed OrbitControls instantiation
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true; // Optional: gives a smooth inertia effect
// const controls.dampingFactor = 0.25;
// controls.screenSpacePanning = false;
// const controls.maxPolarAngle = Math.PI / 2; // Optional: limit vertical rotation
// controls.enableZoom = false; // Disable mouse wheel zoom to allow page scrolling

// Variables for mouse tracking and model rotation
let mouseX = 0;
let mouseY = 0;
let targetRotationY = 0;
let targetRotationX = 0;

// Function to check if an element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= window.innerHeight / 2 &&
        rect.bottom >= window.innerHeight / 2
    );
}

// Position arrays for different sections
let arrPositionModel = [
    {
        id: 'hero',
        position: {x: 6, y: 0, z: 0},
        rotation: {x: 0, y: 6, z: 0},
        scale: {x: 8, y: 8, z: 8}
    },
    {
        id: "videos",
        position: { x: -7, y: -2, z: -1 },
        rotation: { x: 0, y:Math.PI / 6 , z: 0 },
        scale: {x: 7, y: 7, z: 7}
    },
    {
        id: "festival",
        position: { x: 8, y: 0, z: 0 },
        rotation: { x: 0, y:0, z: 0 },
        scale: {x: 8, y: 8, z: 8}
    },
    {
        id: "drink",
        position: { x: -10, y: -1, z: -2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: {x: 6, y: 6, z: 6}
    },
     {
        id: "shop",
        position: { x: 10, y: -2, z: -6 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        scale: {x: 4, y: 4, z: 4}
    },
      {
        id: "blog",
        position: { x: -10, y: -2, z: -6 },
        rotation: { x: 0, y: Math.PI / 3, z: 0 },
        scale: {x: 5, y: 5, z: 5}
    },
     {
        id: "about", // About section now handled by special lock logic
        position: { x: 0, y: 1, z: 0 }, // Default position if lock fails (shouldn't happen)
        rotation: { x: 0, y: 0, z: 0 },
        scale: {x: 7, y: 7, z: 7}
    },
];

let arrPositionModelMobile = [
    {
        id: 'hero',
        position: {x: 0, y: -3, z: 2},
        rotation: {x: 0, y: 0, z: 0},
        scale: {x: 4, y: 4, z: 4}
    },
    {
        id: "videos",
        position: { x: -2, y: -4, z: 1 },
        rotation: { x: 0, y: Math.PI / 4, z: 0 },
        scale: {x: 4, y: 4, z: 4}
    },
    {
        id: "festival",
        position: { x: 2, y: -4, z: 1 },
        rotation: { x: 0, y: -Math.PI / 4, z: 0 },
        scale: {x: 4, y: 4, z: 4}
    },
    {
        id: "drink",
        position: { x: -1, y: -2, z: 2 },
        rotation: { x: 0, y: Math.PI / 6, z: 0 },
        scale: {x: 5, y: 5, z: 5}
    },
     {
        id: "shop",
        position: { x: 1, y: -3, z: 2 },
        rotation: { x: 0, y: -Math.PI / 6, z: 0 },
        scale: {x: 5, y: 5, z: 5}
    },
      {
        id: "blog",
        position: { x: 0, y: -3, z: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: {x: 4, y: 4, z: 4}
    },
     {
        id: "about", // About section now handled by special lock logic
        position: { x: 0, y: -3, z: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: {x: 5, y: 5, z: 5}
    },
];

const modelMove = () => {
    const sections = document.querySelectorAll('.section');
    let currentSectionId = 'hero';
    let closestSectionTop = Infinity;

    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        // Check if the middle of the section is in the viewport
        const sectionMiddle = rect.top + rect.height / 2;
        if (sectionMiddle >= 0 && sectionMiddle <= window.innerHeight) {
             // This is an alternative check if the previous one is not accurate
             // if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                // This is the section currently in view (or closest to center)
                // Let's refine this to find the section whose middle is closest to the viewport middle
                const viewportMiddle = window.innerHeight / 2;
                const distanceToMiddle = Math.abs(sectionMiddle - viewportMiddle);

                if (distanceToMiddle < closestSectionTop) { // Use distanceToMiddle here
                     closestSectionTop = distanceToMiddle; // Update closest distance
                     currentSectionId = section.id;
                }
            // }
        }
    });

    // If we're in the about section, lock the model to the mascot position
    if (currentSectionId === 'about') {
        const mascotElement = document.querySelector('.lemon-mascot');
        if (mascotElement && modelGroup) {
            const rect = mascotElement.getBoundingClientRect();
            const mascotCenterX = rect.left + rect.width / 2;
            const mascotCenterY = rect.top + rect.height / 2;

            const vector = new THREE.Vector3();
            vector.x = (mascotCenterX / window.innerWidth) * 2 - 1;
            vector.y = -(mascotCenterY / window.innerHeight) * 2 + 1;
            vector.z = 0.5; // Adjust Z for desired depth relative to mascot

            vector.unproject(camera);
            const dir = vector.sub(camera.position).normalize();
            // Calculate distance to a plane that contains the mascot's screen position
            // A simpler approach is to find where the ray intersects a plane at the mascot's Z depth
            // This might require getting the mascot's 3D world position, which is tricky with 2D elements
            // Let's use the previous approach which seemed to work for locking initially
            const distance = -camera.position.z / dir.z;
            const pos = camera.position.clone().add(dir.multiplyScalar(distance));

            // Animate to the locked position for smoothness
            gsap.to(modelGroup.position, {
                x: pos.x,
                y: pos.y,
                z: pos.z,
                duration: 0.8, // Animation duration
                ease: "power2.out"
            });
            gsap.to(modelGroup.rotation, {
                 x: 0, y: 0, z: 0,
                 duration: 0.8,
                 ease: "power2.out"
            });
            gsap.to(modelGroup.scale, {
                 x: 5, y: 5, z: 5,
                 duration: 0.8,
                 ease: "power2.out"
            });

            // Disable mouse follow effect while in about section
            targetRotationY = 0;
            targetRotationX = 0;
            // No return here, allow mouse follow updates if needed (though setting targets to 0)
        }
    } else {
        // Normal movement for other sections using the position arrays
        const isMobile = window.innerWidth < 768;
        const activePositionArray = isMobile ? arrPositionModelMobile : arrPositionModel;
        const foundSection = activePositionArray.find(val => val.id === currentSectionId);
        
        if (foundSection && modelGroup) {
            const randomIntensity = 0.5; // Keep random intensity
            const targetPosition = {
                x: foundSection.position.x + (Math.random() - 0.5) * randomIntensity,
                y: foundSection.position.y + (Math.random() - 0.5) * randomIntensity,
                z: foundSection.position.z + (Math.random() - 0.5) * randomIntensity
            };
            const targetRotation = {
                x: foundSection.rotation.x + (Math.random() - 0.5) * randomIntensity * 0.5,
                y: foundSection.rotation.y + (Math.random() - 0.5) * randomIntensity * 0.5,
                z: foundSection.rotation.z + (Math.random() - 0.5) * randomIntensity * 0.5
            };
            const targetScale = {
                 x: foundSection.scale.x + (Math.random() - 0.5) * randomIntensity * 0.2,
                 y: foundSection.scale.y + (Math.random() - 0.5) * randomIntensity * 0.2,
                 z: foundSection.scale.z + (Math.random() - 0.5) * randomIntensity * 0.2
            };

            // Animate to the target position, rotation, and scale
            gsap.to(modelGroup.position, {
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z,
                duration: 1.5,
                ease: "back.inOut(1.2)"
            });
            gsap.to(modelGroup.rotation, {
                x: targetRotation.x,
                y: targetRotation.y,
                z: targetRotation.z,
                duration: 1.5,
                ease: "back.inOut(1.2)"
            });
            gsap.to(modelGroup.scale, {
                 x: targetScale.x,
                 y: targetScale.y,
                 z: targetScale.z,
                 duration: 1.5,
                 ease: "back.inOut(1.7)"
            });
            
            // Mouse follow remains active in other sections
        }
    }
}

// Add scroll event listener
window.addEventListener('scroll', () => {
    if (modelGroup) { // Ensure group is loaded before trying to move it
        modelMove();
    }
});

// Add mousemove event listener
document.addEventListener('mousemove', (event) => {
    // Only apply mouse follow if not in the about section
     const aboutSection = document.getElementById('about');
     if (aboutSection && !isInViewport(aboutSection)) {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        targetRotationY = mouseX * 0.5;
        targetRotationX = mouseY * -0.5;
     } else {
        // Reset target rotation when in about section to prevent sudden snaps when leaving
        targetRotationY = 0;
        targetRotationX = 0;
     }
});

const reRender3D = () => {
    requestAnimationFrame(reRender3D);
    renderer.render(scene, camera);
    
    if(mixer) mixer.update(0.02);

    // Apply damping for mouse follow effect only if not in about section
     const aboutSection = document.getElementById('about');
     if (modelGroup && aboutSection && !isInViewport(aboutSection)) {
        const dampingFactor = 0.05;
        modelGroup.rotation.y += (targetRotationY - modelGroup.rotation.y) * dampingFactor;
        modelGroup.rotation.x += (targetRotationX - modelGroup.rotation.x) * dampingFactor;
     }
};

reRender3D();

// Handle window resize
window.addEventListener('resize', () => {
    const container = document.getElementById('container3D');
    if (container) {
        renderer.setSize(container.clientWidth, container.clientHeight);
        camera.aspect = container.clientWidth / container.clientHeight;
    }
    camera.updateProjectionMatrix();
});