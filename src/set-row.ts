import { MAX_ROWS } from "./constants";
import { rowElement } from "./elems";
import { resetScene } from "./scene";
import { state } from "./state";

const getRowsSetter = (calc: (rows: number) => number) => () => {
  state.blockRows = calc(state.blockRows);
  rowElement.textContent = state.blockRows.toString();
  resetScene();
};

export const incrementRows = getRowsSetter((r) => (r === MAX_ROWS ? r : r + 1));
export const decrementRows = getRowsSetter((r) => (r === 1 ? r : r - 1));
