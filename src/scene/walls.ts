import * as THREE from "three";

const WALL_THICKNESS = 1.5;
const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0x222222,
  emissive: new THREE.Color(0x222222),
});
const wallGeometry = new THREE.BoxGeometry(WALL_THICKNESS * 2, 10);

export const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
leftWall.position.set(-5 - WALL_THICKNESS, 0, 0);

export const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
rightWall.position.set(5 + WALL_THICKNESS, 0, 0);

const topWallGeometry = new THREE.BoxGeometry(10, WALL_THICKNESS * 2);
export const topWall = new THREE.Mesh(topWallGeometry, wallMaterial);
topWall.position.set(0, 3 + WALL_THICKNESS, 0);
