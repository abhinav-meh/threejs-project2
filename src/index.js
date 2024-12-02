import * as THREE from 'three';
import * as dat from 'dat.gui';
// import { color } from 'three/webgpu';

const gui = new dat.GUI();

//textures loader
const loader = new THREE.TextureLoader();
const height = loader.load('./static/height.jpg');
const texture =  loader.load('./static/texture.jpg');
const alpha = loader.load('./static/alpha.png');



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

gui.add(camera.position, 'z');
gui.add(camera.position, 'y');
gui.add(camera.position, 'x');

//rernderer
const renderer = new THREE.WebGLRenderer({
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
const pointLight = new THREE.PointLight('#00b3ff', 110);
pointLight.position.x = 1.9;
pointLight.position.y = 3.1;
pointLight.position.z = 0.82;
scene.add(pointLight);

gui.add(pointLight.position, 'x')
gui.add(pointLight.position, 'y')
gui.add(pointLight.position, 'z')
gui.add(pointLight, 'intensity')
const col = {color: '#00ff00'}

gui.addColor(col, 'color').onChange(() => {
    pointLight.color.set(col.color);
})

// Objects
const plane = new THREE.PlaneGeometry(14, 14, 64, 64);

//Materials
const material = new THREE.MeshStandardMaterial({
    wireframe: true,
  color: '#00b3ff',
//   map: texture,
  displacementMap: height,
  displacementScale: 1.2,
  alphaMap: alpha,
  transparent: true,
  depthTest: false,
});


//Mesh
const planeMesh = new THREE.Mesh(plane, material);
planeMesh.rotation.x = 4.9;
scene.add(planeMesh);

gui.add(planeMesh.rotation, 'x')

//mouse
document.addEventListener('mousemove', animateTerrain);
let mouseY = 0;

function animateTerrain(event) {
  mouseY = event.clientY;
}


// Animation loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();
//   planeMesh.rotation.z = 0.5 * elapsedTime;

planeMesh.material.displacementScale = 0.5 + mouseY * 0.0008;

  renderer.render(scene, camera);
}

animate();