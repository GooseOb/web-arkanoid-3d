import * as THREE from "three";
import { scene } from "..";
import { Asteroid } from "../../asteroid";
import { getRandomColor } from "../../colors";
import {
  SPAWN_DEPTH,
  WALL_BOTTOM,
  WALL_LEFT,
  WALL_RIGHT,
  WALL_TOP,
} from "../../constants";

export const spawnRandomAsteroid = () => {
  const radius = Math.random() * 0.4 + 0.1;
  const asteroid = new Asteroid(radius, getRandomColor(), getRandomColor());

  const randVel = () => (Math.random() - 0.5) * 0.02;
  const velocityZ = (Math.random() - 0.6) * 0.02;

  switch (Math.floor(Math.random() * 4)) {
    case 0: // Left wall
      asteroid.position.set(WALL_LEFT, Math.random() * 6 - 3, SPAWN_DEPTH);
      asteroid.velocity = new THREE.Vector3(randVel(), randVel(), velocityZ);
      break;
    case 1: // Right wall
      asteroid.position.set(WALL_RIGHT, Math.random() * 6 - 3, SPAWN_DEPTH);
      asteroid.velocity = new THREE.Vector3(-randVel(), randVel(), velocityZ);
      break;
    case 2: // Top wall
      asteroid.position.set(Math.random() * 10 - 5, WALL_TOP, SPAWN_DEPTH);
      asteroid.velocity = new THREE.Vector3(randVel(), -randVel(), velocityZ);
      break;
    case 3: // Bottom wall
      asteroid.position.set(Math.random() * 10 - 5, WALL_BOTTOM, SPAWN_DEPTH);
      asteroid.velocity = new THREE.Vector3(randVel(), randVel(), velocityZ);
      break;
  }

  scene.add(asteroid);

  return asteroid;
};
