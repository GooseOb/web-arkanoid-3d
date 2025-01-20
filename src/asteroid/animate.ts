import * as THREE from "three";
import {
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  PADDLE_DEPTH,
  BALL_RADIUS,
  WALL_DEPTH,
} from "../constants";
import {
  scene,
  paddle,
  ball,
  removeBlocks,
  removeAsteroidsOutOfBounds,
  spawnRandomAsteroid,
} from "../scene";
import { createExplosion } from "../explode";
import { Asteroid, AsteroidShaderMaterial } from "../asteroid";
import { asteroidExplosionSound } from "../sounds/asteroid";
import { camera } from "../camera";

const isPaddleCollision = (asteroid: Asteroid) => {
  const paddleHalfWidth = PADDLE_WIDTH / 2;
  const paddleHalfHeight = PADDLE_HEIGHT / 2;
  const paddleHalfDepth = PADDLE_DEPTH / 2;

  return (
    asteroid.position.x + asteroid.radius >=
      paddle.position.x - paddleHalfWidth &&
    asteroid.position.x - asteroid.radius <=
      paddle.position.x + paddleHalfWidth &&
    asteroid.position.y + asteroid.radius >=
      paddle.position.y - paddleHalfHeight &&
    asteroid.position.y - asteroid.radius <=
      paddle.position.y + paddleHalfHeight &&
    asteroid.position.z + asteroid.radius >=
      paddle.position.z - paddleHalfDepth &&
    asteroid.position.z - asteroid.radius <= paddle.position.z + paddleHalfDepth
  );
};

const isWallCollision = (object: THREE.Mesh) =>
  object.position.z > -WALL_DEPTH / 2 &&
  object.position.z < WALL_DEPTH / 2 &&
  (object.position.x < -5 || object.position.x > 5 || object.position.y > 3);

let asteroidSpawnCooldown = 0;
export const animateAsteroids = () => {
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
        object.position.distanceTo(ball.position) <
          object.radius + BALL_RADIUS ||
        isPaddleCollision(object) ||
        isWallCollision(object)
      ) {
        let sound: THREE.PositionalAudio | undefined;
        if (camera.position.distanceTo(object.position) < 10) {
          sound = asteroidExplosionSound.clone();
        }
        createExplosion(object.position.clone(), object.color, sound);
        scene.remove(object);
      }

      // Check collision with other asteroids
      for (const otherObject of scene.children) {
        if (otherObject instanceof Asteroid && otherObject !== object) {
          if (
            object.position.distanceTo(otherObject.position) <
            object.radius + otherObject.radius
          ) {
            createExplosion(object.position.clone(), object.color);
            createExplosion(otherObject.position.clone(), object.color);
            scene.remove(object);
            scene.remove(otherObject);
          }
        }
      }

      removeBlocks(
        (block) => object.position.distanceTo(block.position) < object.radius,
      );
    }
  });

  removeAsteroidsOutOfBounds();

  asteroidSpawnCooldown -= 1;
  if (asteroidSpawnCooldown <= 0) {
    spawnRandomAsteroid();
    // Spawn every 1-3 seconds
    asteroidSpawnCooldown = Math.floor(Math.random() * 200) + 100;
  }
};
