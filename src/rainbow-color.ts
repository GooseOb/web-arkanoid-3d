import { Color } from "three";

export const getRainbowColor = (total: number, i: number) =>
  new Color().setHSL(i / total, 1, 0.5);
