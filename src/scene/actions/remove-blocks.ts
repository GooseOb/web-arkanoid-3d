import * as THREE from "three";
import { state } from "../../state";
import { scene } from "..";
import { createExplosion } from "../../explode";
import { glassSound } from "../../sounds/glass";

export const removeBlocks = (
  predicate: (block: THREE.Mesh) => boolean,
  beforeRemoval?: () => void,
) => {
  state.blocks = state.blocks.filter((block) => {
    if (predicate(block)) {
      const blockColor = (block.material as THREE.MeshStandardMaterial).color;
      createExplosion(block.position.clone(), blockColor, glassSound);
      beforeRemoval?.();
      scene.remove(block);
      return false;
    }
    return true;
  });
};
