import * as THREE from "three";
import { listener } from "./listener";
import url from "/978__rhumphries__rbh-glass_break-02.wav";

export const glassSound = new THREE.PositionalAudio(listener);

const loader = new THREE.AudioLoader();
loader.load(url, (buffer) => {
  glassSound.setBuffer(buffer);
  glassSound.setLoop(false);
  glassSound.setVolume(1);
});
