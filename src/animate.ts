import { state } from "./state";
import {
  MAX_BALL_SPEED,
  BLOCK_COLS,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
} from "./constants";
import { lose, win } from "./end";
import { speedElement, scoreElement } from "./elems";
import { scene, paddle, ball, removeBlocks } from "./scene";
import { camera } from "./camera";
import { renderer } from "./renderer";
import { animateAsteroids } from "./asteroid";

const BALL_ACCELERATION_FACTOR = 1.02;
const animateBall = () => {
  const { x: ballX, y: ballY } = ball.position;

  if (ballX > 4.9 || ballX < -4.9) {
    state.ballSpeed.x *= -1;
  }
  if (ballY > 2.9) {
    state.ballSpeed.y *= -1;
  }

  if (
    ballY <= paddle.position.y + PADDLE_HEIGHT &&
    ballY >= paddle.position.y - PADDLE_HEIGHT &&
    ballX <= paddle.position.x + PADDLE_WIDTH / 2 &&
    ballX >= paddle.position.x - PADDLE_WIDTH / 2
  ) {
    const offset = (ballX - paddle.position.x) / (PADDLE_WIDTH / 2);

    const angle = (Math.PI / 3) * offset;
    const speed = state.ballSpeed.length();

    state.ballSpeed.set(Math.sin(angle) * speed, Math.cos(angle) * speed, 0);

    ball.position.y = paddle.position.y + PADDLE_HEIGHT;
  }

  ball.position.add(state.ballSpeed);

  const oldSpeed = state.ballSpeed.length();
  let newSpeed = oldSpeed;

  removeBlocks(
    (block) => ball.position.distanceTo(block.position) < 0.3,
    () => {
      state.ballSpeed.y *= -1;
      if (newSpeed <= MAX_BALL_SPEED) {
        newSpeed *= BALL_ACCELERATION_FACTOR;
      }
    },
  );

  if (oldSpeed !== newSpeed) {
    state.ballSpeed.setLength(newSpeed);
    speedElement.textContent = (state.ballSpeed.length() * 1e3).toFixed(2);
  }

  const newScore = state.blockRows * BLOCK_COLS - state.blocks.length;
  if (state.score !== newScore) {
    state.score = newScore;
    scoreElement.textContent = newScore.toString();
  }
};

export const animate = () => {
  requestAnimationFrame(animate);

  if (state.isPaused) return;

  animateAsteroids();
  animateBall();

  renderer.render(scene, camera);

  if (state.blocks.length === 0) {
    win();
  } else if (ball.position.y < -3) {
    lose();
  }
};
