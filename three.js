import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';

// Removed getting the container element here, as the canvas will cover the window
// const container = document.getElementById('container3D');

const camera = new THREE.PerspectiveCamera(
    75, // Keep FOV at 75 unless a different value is preferred
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
        
        // modelMove() is called after the model is loaded and DOM is ready
        // modelMove(); 

        // Adjust model scale, position, and rotation after loading
        // Find a scale that looks good over the hero section
        modelGroup.scale.set(140, 140, 140); // Increased scale significantly
        console.log('Model Group scale after adjustment:', modelGroup.scale); // Log group scale
        
        // Set initial position over the hero section
        // These values will need tuning based on visual feedback
        modelGroup.position.set(13, 12, 0); // Adjusted position to the right and slightly down
        console.log('Model Group position after adjustment:', modelGroup.position); // Log group position

        // Set initial rotation (e.g., facing forward or slightly rotated)
        // Rotate 90 degrees around the Z-axis and ~20 degrees around X-axis
        modelGroup.rotation.set(0, 0, Math.PI / 2); // Added ~20 degree X-axis rotation
        console.log('Model Group rotation after adjustment:', modelGroup.rotation); // Log group rotation

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
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Reduced ambient light intensity
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1); // Increased directional light intensity significantly
topLight.position.set(750, 750, 750); // Adjusted directional light position (e.g., top-right-front)
scene.add(topLight);

const bottomLight = new THREE.DirectionalLight(0xffffff, 0.75); // You can adjust intensity as needed
bottomLight.position.set(-250, -500, 500); // Below and in front of the object
scene.add(bottomLight);



// Bring back AxesHelper for debugging
const axesHelper = new THREE.AxesHelper( 5 ); // Size 5
scene.add( axesHelper );

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
};
reRender3D(); // Start continuous render loop

let arrPositionModel = [
    {
        id: 'hero', // Corresponds to the #hero section
        position: {x: 13, y: 12, z: 0}, // Adjusted position for hero section - Matching initial position
        rotation: {x: 0, y: 0, z: Math.PI / 2}, // Added 90 degree Z-axis rotation to hero position
        scale: {x: 140, y: 140, z: 140} // Add scale for hero section (using current initial scale)
    },
    {
        id: "videos", // Corresponds to the #videos section
        position: { x: 5, y: -2, z: -5 }, // Adjust position for videos section
        rotation: { x: 0, y: Math.PI / 4, z: 0 }, // Example rotation
        scale: {x: 1, y: 1, z: 1} // Add a default scale for other sections
    },
    {
        id: "festival", // Corresponds to the #festival section
        position: { x: -5, y: -3, z: -8 }, // Adjust position for festival section
        rotation: { x: 0, y: -Math.PI / 4, z: 0 }, // Example rotation
        scale: {x: 1, y: 1, z: 1} // Add a default scale for other sections
    },
    {
        id: "drink", // Corresponds to the #drink section
        position: { x: 0, y: -1, z: -2 }, // Adjust position for drink section
        rotation: { x: 0, y: Math.PI, z: 0 }, // Example rotation
        scale: {x: 1, y: 1, z: 1} // Add a default scale for other sections
    },
     {
        id: "shop", // Corresponds to the #shop section
        position: { x: 8, y: -2, z: -6 }, // Adjust position for shop section
        rotation: { x: 0, y: -Math.PI / 2, z: 0 }, // Example rotation
        scale: {x: 1, y: 1, z: 1} // Add a default scale for other sections
    },
      {
        id: "blog", // Corresponds to the #blog section
        position: { x: -8, y: -2, z: -6 }, // Adjust position for blog section
        rotation: { x: 0, y: Math.PI / 2, z: 0 }, // Example rotation
        scale: {x: 1, y: 1, z: 1} // Add a default scale for other sections
    },
     {
        id: "about", // Corresponds to the #about section
        position: { x: 5, y: 0, z: 0 }, // Adjusted position for about section - Centered horizontally, slightly down vertically, pushed back slightly in Z
        rotation: { x: 0, y: 0, z: Math.PI / 2 }, // Keep existing rotation for about section
        scale: {x: 100, y: 100, z: 100} // Add a scale for about section (example)
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

    // Ensure we have a valid section ID, fallback to 'hero' if needed
    const foundSection = arrPositionModel.find(val => val.id === currentSectionId);
     if (!foundSection) {
         currentSectionId = 'hero';
     }

    let position_active_index = arrPositionModel.findIndex(
        (val) => val.id === currentSectionId
    );

    if (position_active_index >= 0) {
        let new_coordinates = arrPositionModel[position_active_index];
        // Apply GSAP tweens to the model group
        gsap.to(modelGroup.position, {
            x: new_coordinates.position.x,
            y: new_coordinates.position.y,
            z: new_coordinates.position.z,
            duration: 1.5, // Keep duration for smooth animation between points
            ease: "power2.inOut"
        });
        gsap.to(modelGroup.rotation, {
            x: new_coordinates.rotation.x,
            y: new_coordinates.rotation.y,
            z: new_coordinates.rotation.z,
            duration: 1.5, // Keep duration for smooth animation between points
            ease: "power2.inOut"
        });
        // Add GSAP tween for scale
        gsap.to(modelGroup.scale, {
            x: new_coordinates.scale.x,
            y: new_coordinates.scale.y,
            z: new_coordinates.scale.z,
            duration: 1.5, // Keep duration for smooth animation between points
            ease: "power2.inOut"
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
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // Continuous rendering is active, no need to re-render here
    // reRender3D();
})