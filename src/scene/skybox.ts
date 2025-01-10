import * as THREE from "three";
import skyboxUrl from "/HDR_blue_nebulae-1.jpg";

const texture = new THREE.TextureLoader().load(skyboxUrl);

texture.mapping = THREE.EquirectangularReflectionMapping;
texture.colorSpace = THREE.SRGBColorSpace;

const skyboxGeometry = new THREE.SphereGeometry(100, 32, 32);
const skyboxMaterial = new THREE.MeshBasicMaterial({
  map: texture,
  side: THREE.BackSide,
});

export const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
