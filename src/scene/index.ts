import * as THREE from "three";
import { paddle } from "./paddle";
import { ball } from "./ball";
import { leftWall, rightWall, topWall } from "./walls";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

scene.add(leftWall);
scene.add(rightWall);
scene.add(topWall);
scene.add(paddle);
scene.add(ball);

scene.add(new THREE.AmbientLight(0xffffff, 0.2));

export { scene, paddle, ball, rightWall, leftWall, topWall };
