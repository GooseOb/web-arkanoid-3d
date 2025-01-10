import { paddle } from "./scene";
import { resetScene } from "./reset";
import { decreaseRows, increaseRows } from "./set-row";
import { animate } from "./animate";
import { camera } from "./camera";
import { renderer } from "./renderer";
import { state } from "./state";

window.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth) * 2 - 1;
  paddle.position.x = x * 4.5;
});

window.addEventListener("keyup", (e) => {
  if (e.ctrlKey) return;
  switch (e.key) {
    case "r":
      resetScene();
      break;
    case "p":
    case " ":
      pause();
      break;
    case "+":
    case "=":
      increaseRows();
      break;
    case "-":
      decreaseRows();
  }
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const pause = () => {
  state.isPaused = !state.isPaused;
};

document.getElementById("reset")!.addEventListener("click", resetScene);
document.getElementById("pause")!.addEventListener("click", pause);
document.getElementById("plus-row")!.addEventListener("click", increaseRows);
document.getElementById("minus-row")!.addEventListener("click", decreaseRows);

document.body.appendChild(renderer.domElement);

resetScene();
animate();
