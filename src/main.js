import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

import * as THREE from 'three';
import { OrbitControls, ThreeMFLoader } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera
(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg")
})


renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera)

camera.position.setZ(10);

const geometry = new THREE.CylinderGeometry(5, 5, 0.5, 32);
const material = new THREE.MeshStandardMaterial({ color: 0xaa00ff });
const cylinder = new THREE.Mesh(geometry, material);
scene.add(cylinder);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);

const globeTexture = new THREE.TextureLoader().load('earth.jpg');
const globe = new THREE.Mesh(
  new THREE.SphereGeometry(1.5, 12, 16),
  new THREE.MeshStandardMaterial({
    map: globeTexture
  })
);
globe.position.y += 1.3;
scene.add(globe);

const geometryRoof = new THREE.CylinderGeometry(3, 4.5, 1, 32);
const materialRoof = new THREE.MeshStandardMaterial({ color: 0xaa00ff });
const cylinderRoof = new THREE.Mesh(geometryRoof, materialRoof);
cylinderRoof.position.y += 3;
scene.add(cylinderRoof);

loader.load('horse.glb', (gltf) => {
  const baseHorse = gltf.scene;
  baseHorse.scale.set(0.1, 0.1, 0.1);

  const numHorses = 8;
  const radius = 4.5;

  for (let i = 0; i < numHorses; i++) {
    const angle = (i / numHorses) * Math.PI * 2;
    const horse = baseHorse.clone();

    horse.position.x = Math.cos(angle) * radius;
    horse.position.z = Math.sin(angle) * radius;

    horse.rotation.y = -angle + Math.PI / 13;

    scene.add(horse);
  }
});

function animate() {
  requestAnimationFrame(animate);

  scene.children.forEach(child => {
    if (child instanceof THREE.Mesh) {
      child.rotation.y += 0.01;
    }
  });

  renderer.render(scene, camera);
}

animate();
