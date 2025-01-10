import * as THREE from "three";
import { rowElement } from "./elems";

export const state = {
  blockRows: +rowElement.textContent!,
  blocks: [] as THREE.Mesh[],
  ballSpeed: new THREE.Vector3(0.0, 0.0, 0),
  score: 0,
  isPaused: false,
};
