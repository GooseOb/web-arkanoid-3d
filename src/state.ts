import * as THREE from "three";
import { rowElement } from "./elems";
import type { Asteroid } from "./asteroid";

export const state = {
  blockRows: +rowElement.textContent!,
  blocks: [] as THREE.Mesh[],
  asteroids: [] as Asteroid[],
  ballSpeed: new THREE.Vector3(0.0, 0.0, 0),
  score: 0,
  isPaused: false,
};
