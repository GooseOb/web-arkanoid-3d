import * as THREE from "three";
import { scene } from "./scene";

export const createExplosion = (
  position: THREE.Vector3,
  color: THREE.Color,
  sound?: THREE.Audio | THREE.PositionalAudio,
) => {
  const PARTICLE_COUNT = 50;
  const PARTICLE_SIZE = 0.1;

  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  const velocities: number[] = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions.push(position.x, position.y, position.z);

    velocities.push(
      (Math.random() - 0.5) * 2, // x
      (Math.random() - 0.5) * 2, // y
      (Math.random() - 0.5) * 2, // z
    );
  }

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

  const explosionLight = new THREE.PointLight(color, 1.5, 5);
  explosionLight.position.copy(position);

  scene.add(explosionLight);
  scene.add(particles);

  if (sound) {
    sound = sound.clone();
    sound.position.copy(position);
    console.log(sound.position);
    sound.play();
  }

  const DURATION = 0.5;
  const startTime = performance.now();
  const animateParticles = () => {
    const elapsedTime = (performance.now() - startTime) / 1000;
    if (elapsedTime > DURATION) {
      scene.remove(particles);
      scene.remove(explosionLight);
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

    explosionLight.intensity = Math.max(1.5 * (0.3 - elapsedTime), 0);
    material.opacity = 1.0 - elapsedTime / DURATION;

    requestAnimationFrame(animateParticles);
  };

  animateParticles();
};
