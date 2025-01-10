import * as THREE from "three";
import { BALL_RADIUS } from "../constants";

const ballGeometry = new THREE.SphereGeometry(BALL_RADIUS, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const ball = new THREE.PointLight(0xff6666, 2, 800);
ball.add(new THREE.Mesh(ballGeometry, ballMaterial));

export { ball };
