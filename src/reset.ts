import * as THREE from "three";
import { state } from "./state";
import { MIN_BALL_SPEED, BLOCK_COLS, BLOCK_SIZE } from "./constants";
import { getRainbowColor } from "./colors";
import { scene, paddle, ball } from "./scene";

export const resetScene = () => {
  for (const block of state.blocks) scene.remove(block);
  state.blocks = [];
  paddle.position.y = -2.5;

  ball.position.y = -2.3;
  state.ballSpeed.set(MIN_BALL_SPEED, MIN_BALL_SPEED, 0);

  for (let i = 0; i < state.blockRows; i++) {
    const rowMaterial = new THREE.MeshStandardMaterial({
      color: getRainbowColor(state.blockRows, i),
      emissive: new THREE.Color(0x000000),
    });
    const a = (BLOCK_COLS - 1) / 2;
    for (let j = -a; j <= a; j++) {
      const block = new THREE.Mesh(
        new THREE.BoxGeometry(
          BLOCK_SIZE.width,
          BLOCK_SIZE.height,
          BLOCK_SIZE.depth,
        ),
        rowMaterial,
      );
      block.position.set(j * 0.6, 2.9 - i * BLOCK_SIZE.height + i * -0.1, 0);
      state.blocks.push(block);
      scene.add(block);
    }
  }
};
