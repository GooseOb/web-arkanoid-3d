import * as THREE from "three";
import { camera } from "../camera";

export const listener = new THREE.AudioListener();
listener.position.copy(camera.position);
camera.add(listener);

export const resumeAudioContext = () => {
  if (listener.context.state === "suspended") {
    listener.context
      .resume()
      .then(() => {
        console.log("AudioContext resumed successfully");
      })
      .catch((error) => {
        console.error("Error resuming AudioContext:", error);
      });
  }
};
