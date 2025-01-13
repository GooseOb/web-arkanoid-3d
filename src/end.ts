import { resetScene } from "./scene";
import { incrementRows } from "./set-row";
import { state } from "./state";

const end = (message: string) => {
  alert(message + " Your score: " + state.score);
  resetScene();
};

export const win = () => {
  incrementRows();
  end("You win!");
};

export const lose = () => {
  end("Game over!");
};
