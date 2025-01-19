import * as THREE from "three";
import { listener } from "./listener";
import url from "/625114__newlocknew__expldsgn_powerful-explosion-21_em_28lrs.wav";

export const asteroidExplosionSound = new THREE.PositionalAudio(listener);

const loader = new THREE.AudioLoader();
loader.load(url, (buffer) => {
  asteroidExplosionSound.setBuffer(buffer);
  asteroidExplosionSound.setLoop(false);
  asteroidExplosionSound.setVolume(1);
  asteroidExplosionSound.setDistanceModel("inverse");
  asteroidExplosionSound.setRefDistance(5); // Full volume within 5 units
  asteroidExplosionSound.setMaxDistance(10); // Sound is inaudible beyond 50 units
  asteroidExplosionSound.setRolloffFactor(2);
});
