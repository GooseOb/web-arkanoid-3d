import * as THREE from "three";
import { WALL_DEPTH, WALL_THICKNESS } from "../constants";
import textureUrl from "/corrugated-dark-matte-powder-coated-metal-1845-mm-architextures.jpg";

const texture = new THREE.TextureLoader().load(textureUrl);
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(3, 3);

const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0xbbbbbb,
  map: texture,
  emissive: new THREE.Color(0x111111),
});
const wallGeometry = new THREE.BoxGeometry(WALL_THICKNESS * 2, 100, WALL_DEPTH);

const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
leftWall.position.set(-5 - WALL_THICKNESS, 0, 0);

const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
rightWall.position.set(5 + WALL_THICKNESS, 0, 0);

const topWallGeometry = new THREE.BoxGeometry(
  10,
  WALL_THICKNESS * 2,
  WALL_DEPTH,
);
const topWall = new THREE.Mesh(topWallGeometry, wallMaterial);
topWall.position.set(0, 3 + WALL_THICKNESS, 0);

export { leftWall, rightWall, topWall };
