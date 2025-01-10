import * as THREE from "three";

export class AsteroidShaderMaterial extends THREE.ShaderMaterial {
  constructor(color1: THREE.Color, color2: THREE.Color) {
    super({
      uniforms: {
        color1: { value: color1 },
        color2: { value: color2 },
        time: { value: 0 },
      },
    });
  }

  vertexShader = `
    varying vec3 vPosition;
    void main() {
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  fragmentShader = `
    uniform vec3 color1;
    uniform vec3 color2;
    uniform float time;
    varying vec3 vPosition;

    void main() {
      float intensity = abs(sin(vPosition.x + vPosition.y + vPosition.z + time));
      gl_FragColor = vec4(mix(color1, color2, intensity), 1.0);
    }
  `;
}
