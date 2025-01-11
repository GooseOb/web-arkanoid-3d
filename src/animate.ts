import * as THREE from "three";
import { state } from "./state";
import {
  MIN_BALL_SPEED,
  MAX_BALL_SPEED,
  BLOCK_COLS,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  WALL_THICKNESS,
  PADDLE_DEPTH,
} from "./constants";
import { end } from "./end";
import { speedElement, scoreElement } from "./elems";
import { scene, paddle, ball } from "./scene";
import { camera } from "./camera";
import { renderer } from "./renderer";
import { createExplosion } from "./explode";
import { Asteroid, AsteroidShaderMaterial } from "./asteroid";
import { getRandomColor } from "./colors";

const WALL_LEFT = -20;
const WALL_RIGHT = 20;
const WALL_TOP = 20;
const WALL_BOTTOM = -30;
const SPAWN_DEPTH = -10; // Define depth where asteroids will spawn from

const spawnAsteroid = () => {
  const asteroid = new Asteroid(getRandomColor(), getRandomColor());

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

const removeAsteroidsOutOfBounds = () => {
  scene.children = scene.children.filter((object) => {
    if (object instanceof Asteroid) {
      const { x, y, z } = object.position;

      const MOD = 20;
      if (
        x < WALL_LEFT * MOD ||
        x > WALL_RIGHT * MOD ||
        y < WALL_BOTTOM * MOD ||
        y > WALL_TOP * MOD ||
        z > 5
      ) {
        scene.remove(object);
        return false;
      }
    }
    return true;
  });
};

const asteroidCount = Math.floor(Math.random() * 100) + 200;
for (let i = 0; i < asteroidCount; i++) {
  const asteroid = spawnAsteroid();
  asteroid.position.add(asteroid.velocity.clone().multiplyScalar(2000));
}

const isPaddleCollision = (object: THREE.Mesh) =>
  object.position.y <= paddle.position.y + PADDLE_HEIGHT &&
  object.position.y >= paddle.position.y - PADDLE_HEIGHT &&
  object.position.x >= paddle.position.x - PADDLE_WIDTH / 2 &&
  object.position.x <= paddle.position.x + PADDLE_WIDTH / 2 &&
  object.position.z >= paddle.position.z - PADDLE_DEPTH / 2 &&
  object.position.z <= paddle.position.z + PADDLE_DEPTH / 2;

const isWallCollision = (object: THREE.Mesh) =>
  object.position.z > -WALL_THICKNESS / 2 &&
  object.position.z < WALL_THICKNESS / 2 &&
  (object.position.x < -5 || object.position.x > 5 || object.position.y > 3);

let asteroidSpawnCooldown = 0;
const animateAsteroids = () => {
  scene.children.forEach((object) => {
    if (object instanceof Asteroid) {
      // Rotation
      object.rotation.x += object.rotationSpeed;
      object.rotation.y += object.rotationSpeed;

      // Movement
      object.position.add(object.velocity);

      // Shader animation
      const material = object.material as AsteroidShaderMaterial;
      material.uniforms.time.value += 0.01;

      // Check collision
      if (
        object.position.distanceTo(ball.position) < 0.3 ||
        isPaddleCollision(object) ||
        isWallCollision(object)
      ) {
        createExplosion(object.position.clone(), object.color);
        scene.remove(object);
      }

      // Check collision with other asteroids
      for (const otherObject of scene.children) {
        if (otherObject instanceof Asteroid && otherObject !== object) {
          if (object.position.distanceTo(otherObject.position) < 0.3) {
            createExplosion(object.position.clone(), object.color);
            createExplosion(otherObject.position.clone(), object.color);
            scene.remove(object);
            scene.remove(otherObject);
          }
        }
      }

      for (const block of state.blocks) {
        if (object.position.distanceTo(block.position) < 0.3) {
          createExplosion(
            block.position.clone(),
            (block.material as THREE.MeshStandardMaterial).color,
          );
          createExplosion(object.position.clone(), object.color);
          scene.remove(block);
          scene.remove(object);
        }
      }
    }
  });

  removeAsteroidsOutOfBounds();

  asteroidSpawnCooldown -= 1;
  if (asteroidSpawnCooldown <= 0) {
    spawnAsteroid();
    // Spawn every 1-3 seconds
    asteroidSpawnCooldown = Math.floor(Math.random() * 200) + 100;
  }
};

const BALL_ACCELERATION_FACTOR = 1.03;
export const animate = () => {
  requestAnimationFrame(animate);
  if (state.isPaused) return;
  animateAsteroids();

  const { x: ballX, y: ballY } = ball.position;

  // Ball collision with walls
  if (ballX > 4.9 || ballX < -4.9) {
    state.ballSpeed.x *= -1;
  }
  if (ballY > 2.9) {
    state.ballSpeed.y *= -1;
  }

  // Ball collision with paddle
  if (
    ballY <= paddle.position.y + PADDLE_HEIGHT &&
    ballY >= paddle.position.y - PADDLE_HEIGHT &&
    ballX >= paddle.position.x - PADDLE_WIDTH / 2 &&
    ballX <= paddle.position.x + PADDLE_WIDTH / 2
  ) {
    const offset = (ballX - paddle.position.x) / (PADDLE_WIDTH / 2);

    const angle = (Math.PI / 3) * offset;
    const speed = state.ballSpeed.length();

    state.ballSpeed.set(Math.sin(angle) * speed, Math.cos(angle) * speed, 0);

    ball.position.y = paddle.position.y + PADDLE_HEIGHT;
  }

  // Ball movement
  ball.position.add(state.ballSpeed);

  // Ball collision with blocks
  state.blocks = state.blocks.filter((block) => {
    if (ball.position.distanceTo(block.position) < 0.3) {
      const blockColor = (block.material as THREE.MeshStandardMaterial).color;
      createExplosion(block.position.clone(), blockColor);
      scene.remove(block);
      state.ballSpeed.y *= -1;
      state.ballSpeed.setLength(
        Math.min(
          MAX_BALL_SPEED,
          Math.max(
            MIN_BALL_SPEED,
            state.ballSpeed.length() * BALL_ACCELERATION_FACTOR,
          ),
        ),
      );
      return false;
    }
    return true;
  });

  speedElement.textContent = (state.ballSpeed.length() * 1e3).toFixed(2);
  state.score = state.blockRows * BLOCK_COLS - state.blocks.length;
  scoreElement.textContent = state.score.toString();

  renderer.render(scene, camera);

  if (state.blocks.length === 0) {
    end("You win!");
  } else if (ball.position.y < -3) {
    end("Game over!");
  }
};
