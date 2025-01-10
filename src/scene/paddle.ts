import * as THREE from "three";
import { PADDLE_DEPTH, PADDLE_HEIGHT, PADDLE_WIDTH } from "../constants";

const paddleGeometry = new THREE.BoxGeometry(
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_DEPTH,
);
const paddleMaterial = new THREE.MeshStandardMaterial({
  color: 0xffff00,
  emissive: new THREE.Color(0x00ff66),
});
const paddle = new THREE.PointLight(0x00ff66, 2, 800);
paddle.add(new THREE.Mesh(paddleGeometry, paddleMaterial));

export { paddle };
