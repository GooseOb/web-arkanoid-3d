import { state } from "./state";
import {
  MIN_BALL_SPEED,
  MAX_BALL_SPEED,
  BLOCK_COLS,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
} from "./constants";
import { end } from "./end";
import { speedElement, scoreElement } from "./elems";
import { scene, paddle, ball } from "./scene";
import { camera } from "./camera";
import { renderer } from "./renderer";
import { createExplosion } from "./explode";
import { MeshStandardMaterial } from "three";

const BALL_ACCELERATION_FACTOR = 1.03;
export const animate = () => {
  requestAnimationFrame(animate);
  if (state.isPaused) return;

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
      const blockColor = (block.material as MeshStandardMaterial).color;
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
