import * as THREE from "three";
import { scene } from "./scene";

export const createExplosion = (
  position: THREE.Vector3,
  color: THREE.Color,
) => {
  const PARTICLE_COUNT = 50;
  const PARTICLE_SIZE = 0.05;

  // Create geometry and material for particles
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  const velocities: number[] = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Random initial position (around the block's position)
    positions.push(position.x, position.y, position.z);

    // Random velocity for explosion
    velocities.push(
      (Math.random() - 0.5) * 2, // x
      (Math.random() - 0.5) * 2, // y
      (Math.random() - 0.5) * 2, // z
    );
  }

  // Add positions and velocities to geometry
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.userData.velocities = velocities;

  const material = new THREE.PointsMaterial({
    size: PARTICLE_SIZE,
    color,
    transparent: true,
    opacity: 1.0,
  });

  const particles = new THREE.Points(geometry, material);

  // Add particles to the scene
  scene.add(particles);

  // Animate particles and remove them after a short duration
  const duration = 0.5; // seconds
  const startTime = performance.now();
  const animateParticles = () => {
    const elapsedTime = (performance.now() - startTime) / 1000;
    if (elapsedTime > duration) {
      scene.remove(particles);
      geometry.dispose();
      material.dispose();
      return;
    }

    const positions = geometry.attributes.position.array;
    const velocities = geometry.userData.velocities;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      positions[idx] += velocities[idx] * 0.05; // x
      positions[idx + 1] += velocities[idx + 1] * 0.05; // y
      positions[idx + 2] += velocities[idx + 2] * 0.05; // z
    }

    geometry.attributes.position.needsUpdate = true;

    material.opacity = 1.0 - elapsedTime / duration; // Fade out
    requestAnimationFrame(animateParticles);
  };

  animateParticles();
};
