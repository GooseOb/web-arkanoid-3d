import { scene } from "..";
import { WALL_BOTTOM, WALL_LEFT, WALL_RIGHT, WALL_TOP } from "../../constants";
import { Asteroid } from "../../asteroid";

export const removeAsteroidsOutOfBounds = () => {
  scene.children = scene.children.filter((object) => {
    if (object instanceof Asteroid) {
      const { x, y, z } = object.position;

      const MOD = 20;
      if (
        x < WALL_LEFT * MOD ||
        x > WALL_RIGHT * MOD ||
        y < WALL_BOTTOM * MOD ||
        y > WALL_TOP * MOD ||
        z > 5
      ) {
        scene.remove(object);
        return false;
      }
    }
    return true;
  });
};
