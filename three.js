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
        
    
        // These values will need tuning based on visual feedback
        modelGroup.position.set(6, 0, 0); // Adjusted position to the right and slightly down
        console.log('Model Group position after adjustment:', modelGroup.position); // Log group position

        // Set initial rotation (e.g., facing forward or slightly rotated)
        // Rotate 90 degrees around the Z-axis and ~20 degrees around X-axis
        modelGroup.rotation.set(0, 6, 0); // Added ~20 degree X-axis rotation
        console.log('Model Group rotation after adjustment:', modelGroup.rotation); // Log group rotation


        modelGroup.scale.set(8, 8, 8); // Increased scale significantly
        console.log('Model Group scale after adjustment:', modelGroup.scale); // Log group scale

        // Initial render after model is added - not needed with continuous loop
        // reRender3D();

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

const reRender3D = () => {
    requestAnimationFrame(reRender3D); // Reinstate continuous rendering loop
    // Removed controls.update();
    renderer.render(scene, camera);
    // Reinstate mixer update if model had animations, but it doesn't
    if(mixer) mixer.update(0.02);

    // Add damping for mouse follow effect
    if (modelGroup) { // Ensure modelGroup is loaded
        const dampingFactor = 0.05; // Decreased damping factor for smoother movement
        modelGroup.rotation.y += (targetRotationY - modelGroup.rotation.y) * dampingFactor;
        modelGroup.rotation.x += (targetRotationX - modelGroup.rotation.x) * dampingFactor;
    }

};
reRender3D(); // Start continuous render loop

// Variables for mouse tracking and model rotation
let mouseX = 0;
let mouseY = 0;
let targetRotationY = 0;
let targetRotationX = 0;

// Mousemove event listener
document.addEventListener('mousemove', (event) => {
    // Normalize mouse coordinates to a range like -1 to 1
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    // Map mouse position to target rotation values
    // Adjust the multiplier (e.g., 0.5) to control the amount of rotation
    targetRotationY = mouseX * 0.5;
    targetRotationX = mouseY * -0.5; // Invert X rotation to look towards the cursor vertically
});

let arrPositionModel = [
    {
        id: 'hero', // Corresponds to the #hero section
        position: {x: 6, y: 0, z: 0}, // Adjusted position for hero section - Matching initial position
        rotation: {x: 0, y: 0, z:0}, // Added 90 degree Z-axis rotation to hero position
        scale: {x: 8, y: 8, z: 8} // Add scale for hero section (using current initial scale)
    },
    {
        id: "videos", // Corresponds to the #videos section
        position: { x: -7, y: -2, z: -1 }, // Adjust position for videos section
        rotation: { x: 0, y:Math.PI / 6 , z: 0 }, // Example rotation
        scale: {x: 7, y: 7, z: 7} // Add a default scale for other sections
    },
    {
        id: "festival", // Corresponds to the #festival section
        position: { x: 8, y: 0, z: 0 }, // Adjust position for festival section
        rotation: { x: 0, y:0, z: 0 }, // Example rotation
        scale: {x: 8, y: 8, z: 8} // Add a default scale for other sections
    },
    {
        id: "drink", // Corresponds to the #drink section
        position: { x: -10, y: -1, z: -2 }, // Adjust position for drink section
        rotation: { x: 0, y: 0, z: 0 }, // Example rotation
        scale: {x: 6, y: 6, z: 6} // Add a default scale for other sections
    },
     {
        id: "shop", // Corresponds to the #shop section
        position: { x: 10, y: -2, z: -6 }, // Adjust position for shop section
        rotation: { x: 0, y: -Math.PI / 2, z: 0 }, // Example rotation
        scale: {x: 4, y: 4, z: 4} // Add a default scale for other sections
    },
      {
        id: "blog", // Corresponds to the #blog section
        position: { x: -10, y: -2, z: -6 }, // Adjust position for blog section
        rotation: { x: 0, y: Math.PI / 3, z: 0 }, // Example rotation
        scale: {x: 5, y: 5, z: 5} // Add a default scale for other sections
    },
     {
        id: "about", // Corresponds to the #about section
        position: { x: 0, y: 1, z: 0 }, // Adjusted position for about section - Centered horizontally, slightly down vertically, pushed back slightly in Z
        rotation: { x: 0, y: 0, z: 0 }, // Keep existing rotation for about section
        scale: {x: 7, y: 7, z: 7} // Add a scale for about section (example)
    },
];

// New array for mobile positions
let arrPositionModelMobile = [
    {
        id: 'hero', // Corresponds to the #hero section
        position: {x: 0, y: -3, z: 2}, // Adjusted position for mobile hero (lower and slightly forward)
        rotation: {x: 0, y: 0, z: 0}, // Rotation for mobile hero
        scale: {x: 4, y: 4, z: 4} // Slightly increased scale for mobile hero
    },
    {
        id: "videos", // Corresponds to the #videos section
        position: { x: -2, y: -4, z: 1 }, // Position for mobile videos (left, lower, slightly forward)
        rotation: { x: 0, y: Math.PI / 4, z: 0 }, // Rotation for mobile videos
        scale: {x: 4, y: 4, z: 4} // Slightly increased scale for mobile videos
    },
    {
        id: "festival", // Corresponds to the #festival section
        position: { x: 2, y: -4, z: 1 }, // Position for mobile festival (right, lower, slightly forward)
        rotation: { x: 0, y: -Math.PI / 4, z: 0 }, // Rotation for mobile festival
        scale: {x: 4, y: 4, z: 4} // Slightly increased scale for mobile festival
    },
    {
        id: "drink", // Corresponds to the #drink section
        position: { x: -1, y: -2, z: 2 }, // Position for mobile drink (left, lower, more forward)
        rotation: { x: 0, y: Math.PI / 6, z: 0 }, // Rotation for mobile drink
        scale: {x: 5, y: 5, z: 5} // Increased scale for mobile drink
    },
     {
        id: "shop", // Corresponds to the #shop section
        position: { x: 1, y: -3, z: 2 }, // Position for mobile shop (right, lower, more forward)
        rotation: { x: 0, y: -Math.PI / 6, z: 0 }, // Rotation for mobile shop
        scale: {x: 5, y: 5, z: 5} // Increased scale for mobile shop
    },
      {
        id: "blog", // Corresponds to the #blog section
        position: { x: 0, y: -3, z: 1 }, // Position for mobile blog (lower, slightly forward)
        rotation: { x: 0, y: 0, z: 0 }, // Rotation for mobile blog
        scale: {x: 4, y: 4, z: 4} // Slightly increased scale for mobile blog
    },
     {
        id: "about", // Corresponds to the #about section
        position: { x: 0, y: -3, z: 2 }, // Position for mobile about (lower, more forward)
        rotation: { x: 0, y: 0, z: 0 }, // Rotation for mobile about
        scale: {x: 5, y: 5, z: 5} // Scale for mobile about (kept same)
    },
];

const modelMove = () => {
    const sections = document.querySelectorAll('.section');
    let currentSectionId = 'hero'; // Default to hero if at the very top
    let closestSectionTop = Infinity;

    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        // Find the section whose top is closest to the top of the viewport (but not above it significantly)
        // This logic prioritizes sections as their top edge enters the view
        if (rect.top <= window.innerHeight / 2 && rect.top < closestSectionTop) {
             closestSectionTop = rect.top;
             currentSectionId = section.id;
        }
         // Handle case when scrolling up and the previous section comes back into view
        if (rect.bottom > window.innerHeight / 2 && rect.top < window.innerHeight / 2 && rect.top > -window.innerHeight / 2) {
             currentSectionId = section.id;
        }
    });

    // Determine which position array to use based on screen width
    const isMobile = window.innerWidth < 768; // Using 768px as the breakpoint
    const activePositionArray = isMobile ? arrPositionModelMobile : arrPositionModel;

    // Ensure we have a valid section ID, fallback to 'hero' if needed
    const foundSection = activePositionArray.find(val => val.id === currentSectionId);
     if (!foundSection) {
         currentSectionId = 'hero';
     }

    let position_active_index = activePositionArray.findIndex(
        (val) => val.id === currentSectionId
    );

    if (position_active_index >= 0) {
        let new_coordinates = activePositionArray[position_active_index];

        // Add small random variations to target position and rotation
        const randomIntensity = 0.5; // Adjust this value to control the amount of randomness
        const targetPosition = {
            x: new_coordinates.position.x + (Math.random() - 0.5) * randomIntensity,
            y: new_coordinates.position.y + (Math.random() - 0.5) * randomIntensity,
            z: new_coordinates.position.z + (Math.random() - 0.5) * randomIntensity
        };
        const targetRotation = {
            x: new_coordinates.rotation.x + (Math.random() - 0.5) * randomIntensity * 0.5, // Reduced random rotation
            y: new_coordinates.rotation.y + (Math.random() - 0.5) * randomIntensity * 0.5, // Reduced random rotation
            z: new_coordinates.rotation.z + (Math.random() - 0.5) * randomIntensity * 0.5  // Reduced random rotation
        };

        // Apply GSAP tweens to the model group
        gsap.to(modelGroup.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 1.5, // Increased duration for smoother animation
            ease: "back.inOut(1.2)" // Funky and smooth ease for position
        });
        gsap.to(modelGroup.rotation, {
            x: targetRotation.x,
            y: targetRotation.y,
            z: targetRotation.z,
            duration: 1.5, // Increased duration for smoother animation
            ease: "back.inOut(1.2)" // Unified ease with less overshoot for smoother rotation
        });
        // Add GSAP tween for scale
        gsap.to(modelGroup.scale, {
            x: new_coordinates.scale.x + (Math.random() - 0.5) * randomIntensity * 0.2, // Add small random scale variation
            y: new_coordinates.scale.y + (Math.random() - 0.5) * randomIntensity * 0.2, // Add small random scale variation
            z: new_coordinates.scale.z + (Math.random() - 0.5) * randomIntensity * 0.2, // Add small random scale variation
            duration: 1.5, // Increased duration for smoother animation
            ease: "back.inOut(1.7)" // Funky and smooth ease for scale
        });
        // console.log('Model rotation after modelMove:', bee.rotation); // Log rotation after modelMove
    } else {
        console.log('No position defined for section:', currentSectionId);
    }
}
window.addEventListener('scroll', () => {
    if (modelGroup) { // Ensure group is loaded before trying to move it
        modelMove();
    }
})
window.addEventListener('resize', () => {
    // Use window dimensions for resizing again
    const container = document.getElementById('container3D');
    if (container) {
        renderer.setSize(container.clientWidth, container.clientHeight);
        camera.aspect = container.clientWidth / container.clientHeight;
    }
    camera.updateProjectionMatrix();
    // Continuous rendering is active, no need to re-render here
    // reRender3D();
})