import { resetScene } from "./reset";
import { state } from "./state";

export const end = (message: string) => {
  alert(message + " Your score: " + state.score);
  resetScene();
};
