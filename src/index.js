import * as THREE from 'three';
// import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { color } from 'three/webgpu';

//gui
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl')

//textures loader
const textureLoader = new THREE.TextureLoader();
const height = textureLoader.load('./static/height.jpg');
const texture =  textureLoader.load('./static/texture.jpg');
const alpha = textureLoader.load('./static/alpha.png');

const loader = new GLTFLoader();

loader.load( './static/object.gltf', function ( gltf ) {

	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Scene setup
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 7.7;
camera.position.y = 2.4;
camera.position.x = 0;


//renderer
const renderer = new THREE.WebGLRenderer({
    canvas:  canvas,
    alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
document.body.appendChild(renderer.domElement);

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

//Lights
const pointLight = new THREE.PointLight('#00b3ff', 1200);
pointLight.position.x = 1.9;
pointLight.position.y = 3.1;
pointLight.position.z = 0.82;
scene.add(pointLight);


// Objects
const plane = new THREE.PlaneGeometry(24, 24, 256, 256);

//Materials
const material = new THREE.MeshStandardMaterial({
  wireframe: true,
  color: '#000000',
  map: texture,
  displacementMap: height,
  displacementScale: 1.2,
  alphaMap: alpha,
  transparent: true,
  depthTest: false,
});


//Mesh
const planeMesh = new THREE.Mesh(plane, material);
planeMesh.rotation.x = 5.0;
scene.add(planeMesh);



// Scroll event listener
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    planeMesh.position.y = -scrollPosition * 0.01; // Adjust the factor to control the scroll speed
  });

//mouse
// let startDisplacement = false;

// function handleScroll() {
//   const scrollPosition = window.scrollY;
//   const viewportHeight = window.innerHeight;

//   if (scrollPosition >= viewportHeight) {
//     startDisplacement = true;
//     window.removeEventListener('scroll', handleScroll); // Remove the event listener after the first scroll
//   }
// }

// window.addEventListener('scroll', handleScroll);

// function animateTerrain(event) {
//   mouseY = event.clientY;
// }

// Animation loop
const clock = new THREE.Clock();
const maxDisplacementScale = 1.4;

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();
  planeMesh.rotation.z = 0.05 * elapsedTime;

  planeMesh.material.displacementScale = Math.min(0.5 + elapsedTime * 0.08, maxDisplacementScale);

  renderer.render(scene, camera);
}

animate();