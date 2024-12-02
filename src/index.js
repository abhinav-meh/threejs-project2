import * as THREE from 'three';
import * as dat from 'dat.gui';
// import { color } from 'three/webgpu';

const gui = new dat.GUI();

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Scene setup
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;
camera.position.y = 0;
camera.position.x = 0;

//rernderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
document.body.appendChild(renderer.domElement);

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

//Lights
const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

gui.add(pointLight.position, 'x').min(-3).max(3).step(0.01).name('lightX');
gui.add(pointLight.position, 'y').min(-3).max(3).step(0.01).name('lightY');
gui.add(pointLight.position, 'z').min(-3).max(3).step(0.01).name('lightZ');
gui.add(pointLight, 'intensity').min(0).max(10).step(0.01).name('lightIntensity');
// const col = {color: 0x00ff00}

// gui.addColor(col, 'color').onChange(() => {
//     pointLight.color.set(col.color);
// })

// Objects
const plane = new THREE.PlaneGeometry(3, 3, 64, 64);

//Materials
const material = new THREE.MeshStandardMaterial({
  color: 'red'
});

//Mesh
const planeMesh = new THREE.Mesh(plane, material);
planeMesh.rotation.x = 181;
scene.add(planeMesh);

gui.add(planeMesh.rotation, 'x').min(0).max(10).step(0.01).name('rotationX');

// Animation loop
function animate() {
  requestAnimationFrame(animate);

//  cube.rotation.x += 0.01;
 // cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();