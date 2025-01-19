import * as THREE from "three";
import { listener } from "./listener";
import url from "/625114__newlocknew__expldsgn_powerful-explosion-21_em_28lrs.wav";

export const asteroidExplosionSound = new THREE.PositionalAudio(listener);

const loader = new THREE.AudioLoader();
loader.loadAsync(url).then((buffer) => {
  asteroidExplosionSound.setBuffer(buffer);
  asteroidExplosionSound.setLoop(false);
  asteroidExplosionSound.setVolume(1);
  asteroidExplosionSound.setDistanceModel("inverse");
  asteroidExplosionSound.setRefDistance(5);
  asteroidExplosionSound.setMaxDistance(10);
  asteroidExplosionSound.setRolloffFactor(2);
});
