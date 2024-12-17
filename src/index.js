import * as THREE from 'three';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene setup
const scene = new THREE.Scene();

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(0, 2.4, 7.7);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);

// Handle window resize
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
});

// Lights
const pointLight = new THREE.PointLight('#00b3ff', 1200);
pointLight.position.set(1.9, 3.1, 0.82);
scene.add(pointLight);

// Textures
const textureLoader = new THREE.TextureLoader();
const height = textureLoader.load('./height.jpg');
const texture = textureLoader.load('./texture.jpg');
const alpha = textureLoader.load('./alpha.png');

// Plane Mesh
const planeGeometry = new THREE.PlaneGeometry(24, 24, 256, 256);
const planeMaterial = new THREE.MeshStandardMaterial({
  wireframe: true,
  color: '#000000',
  map: texture,
  displacementMap: height,
  displacementScale: 1.2,
  alphaMap: alpha,
  transparent: true,
  depthTest: false,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = 5.0;
scene.add(planeMesh);

// Interactive Grid
const spacing = 0.5; // Smaller rectangles
const cols = Math.floor(24 / spacing);
const rows = Math.floor(100 / spacing); // Increase the number of rows to ensure the grid is larger than the viewport
const scl = 0.08; // Subtle scaling effect

const gridGroup = new THREE.Group();
scene.add(gridGroup);

const circles = [];
const circleGeometry = new THREE.CircleGeometry(spacing * 0.25, 32); // Circle geometry with 32 segments
for (let i = 0; i < cols; i++) {
  circles[i] = [];
  for (let j = 0; j < rows; j++) {
    const circleMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
    });

    const circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circle.position.set(
      -12 + spacing / 2 + i * spacing, // Centered grid
      -12 + spacing / 2 + j * spacing,
      -0.1 // Slightly behind the plane mesh
    );
    gridGroup.add(circle);
    circles[i][j] = circle;
  }
}

// Adjust grid position to cover space above the plane mesh
gridGroup.position.y = 15; // Move the grid up

// Mouse Interaction
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

// Card-image manager
const teamMembers = document.querySelectorAll('.team-member');
const memberCardImage = document.querySelector('.member-card .member-image');
const memberCardName = document.querySelector('.member-card .card-name');

teamMembers.forEach(member => {
  member.addEventListener('click', () => {
    const memberName = member.getAttribute('data-name');
    const memberImage = member.getAttribute('data-image');

    memberCardImage.src = memberImage;
    memberCardImage.alt = memberName;
    memberCardName.textContent = memberName;
  });
});

// Raycaster
const raycaster = new THREE.Raycaster();

//Scroll event listener
window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY;
  planeMesh.position.y = -scrollPosition * 0.01; // Adjust the factor to control the scroll speed
  gridGroup.position.y = 15 - scrollPosition * 0.01; // Adjust the factor to control the scroll speed
});

function showDetails(name) {
  const selectedNameElement = document.getElementById("selected-name");
  selectedNameElement.textContent = name;
}

document.addEventListener('DOMContentLoaded', () => {
  const teamMembers = document.querySelectorAll('.team-member');
  const memberCard = document.querySelector('.member-card');
  const cardName = document.querySelector('.card-name');
  const memberImage = document.querySelector('.member-image');

  // Team member data
const memberData = {
  member1: {
    name: 'Abhinav Mehrotra',
    image: '/abhinav.JPG'
  },
  member2: {
    name: 'Abe Homer',
    image: '/abe.jpeg'
  },
  member3: {
    name: 'Alex LaFontaine',
    image: '/alex.jpg'
  },
  member4: {
    name: 'Cambria Klinger',
    image: '/cam.jpg'
  },
  member5: {
    name: 'Shalimar Alvarado Cruz Hebbeler',
    image: '/shalimar.jpeg'
  }
};

// Set initial active member
teamMembers[0].classList.add('active');
const initialMember = teamMembers[0].getAttribute('data-member');
cardName.textContent = memberData[initialMember].name;
memberImage.src = memberData[initialMember].image;
memberImage.alt = memberData[initialMember].name;

teamMembers.forEach(member => {
  member.addEventListener('click', () => {
    // Remove active class from all members
    teamMembers.forEach(m => m.classList.remove('active'));
    
    // Add active class to clicked member
    member.classList.add('active');

    // Update member card with clicked member's data
    const memberId = member.getAttribute('data-member');
    cardName.textContent = memberData[memberId].name;
    memberImage.src = memberData[memberId].image;
    memberImage.alt = memberData[memberId].name;
  });
});
});
// Animation loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);

  // Update plane animation
  const elapsedTime = clock.getElapsedTime();
  planeMesh.rotation.z = 0.05 * elapsedTime;
  planeMesh.material.displacementScale = 1.2 + Math.sin(elapsedTime) * 0.6;

  // Update interactive grid
  raycaster.setFromCamera(mouse, camera);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const circle = circles[i][j];
      const dist = new THREE.Vector2(
        mouse.x * 20 - circle.position.x, // Adjusted for grid alignment
        mouse.y * 20 - circle.position.y
      ).length();
      const scale = Math.max(1 - dist * scl, 0.23); // Ensure minimal scale
      circle.scale.set(scale, scale, 1);

      // Fade-in effect from bottom up
      const fadeFactor = Math.max(0.5, Math.min(1, (circle.position.y + 12) / sizes.height));
      circle.material.opacity = Math.min(fadeFactor, 0.08);
    }
  }

  renderer.render(scene, camera);
}

animate();
