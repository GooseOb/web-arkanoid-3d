import * as THREE from "three";
import { listener } from "./listener";
import url from "/35650__sandyrb__am-hybrid-kick-001.wav";

export const kickSound = new THREE.PositionalAudio(listener);

const loader = new THREE.AudioLoader();
loader.load(url, (buffer) => {
  kickSound.setBuffer(buffer);
  kickSound.setLoop(false);
  kickSound.setVolume(1);
});
