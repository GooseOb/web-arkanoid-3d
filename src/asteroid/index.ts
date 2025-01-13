import * as THREE from "three";
import { AsteroidShaderMaterial } from "./material";

class Asteroid extends THREE.Mesh {
  rotationSpeed: number;
  velocity: THREE.Vector3;
  public readonly color: THREE.Color;
  public readonly radius: number;

  constructor(radius: number, color1: THREE.Color, color2: THREE.Color) {
    const geometry = new THREE.SphereGeometry(radius, 16, 16);
    super(geometry, new AsteroidShaderMaterial(color1, color2));
    this.radius = radius;
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
export * from "./animate";
