import * as THREE from "three";
import { paddle } from "./paddle";
import { ball } from "./ball";
import { leftWall, rightWall, topWall } from "./walls";
import { renderer } from "../renderer";
import { camera } from "../camera";
import { skybox } from "./skybox";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

scene.add(leftWall);
scene.add(rightWall);
scene.add(topWall);
scene.add(paddle);
scene.add(ball);

scene.add(new THREE.AmbientLight(0xffffff, 0.2));

scene.add(skybox);

const animateSkybox = () => {
  requestAnimationFrame(animateSkybox);
  skybox.rotation.y += 0.0001;
  renderer.render(scene, camera);
};
animateSkybox();

export { scene, paddle, ball, rightWall, leftWall, topWall };
export * from "./actions";
