import * as THREE from "three";
import { AsteroidShaderMaterial } from "./material";

class Asteroid extends THREE.Mesh {
  rotationSpeed: number;
  velocity: THREE.Vector3;
  public static readonly geometry = new THREE.SphereGeometry(0.3, 16, 16);
  public readonly color: THREE.Color;

  constructor(color1: THREE.Color, color2: THREE.Color) {
    super(Asteroid.geometry, new AsteroidShaderMaterial(color1, color2));
    this.color = color1;
    this.rotationSpeed = Math.random() * 0.01;
    this.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01,
    );
  }
}

export { Asteroid, AsteroidShaderMaterial };
