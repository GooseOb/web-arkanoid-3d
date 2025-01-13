import { scene } from "..";
import { WALL_BOTTOM, WALL_LEFT, WALL_RIGHT, WALL_TOP } from "../../constants";
import { state } from "../../state";

export const removeAsteroidsOutOfBounds = () => {
  state.asteroids = state.asteroids.filter((object) => {
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
    return true;
  });
};
