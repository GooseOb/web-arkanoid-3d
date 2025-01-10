import * as THREE from "three";

const rowElement = document.getElementById("rows")!;

const PADDLE_WIDTH = 1;
const PADDLE_HEIGHT = 0.2;
const BLOCK_SIZE = { width: 0.5, height: 0.2, depth: 0.1 };
let blockRows = +rowElement.textContent!;
const BLOCK_COLS = 15;
const BALL_RADIUS = 0.1;
const MIN_BALL_SPEED = 0.03;
const MAX_BALL_SPEED = 0.1;

const paddleGeometry = new THREE.BoxGeometry(PADDLE_WIDTH, PADDLE_HEIGHT, 0.1);
const paddleMaterial = new THREE.MeshStandardMaterial({
  color: 0xffff00,
  emissive: new THREE.Color(0x00ff66),
});
const paddle = new THREE.PointLight(0x00ff66, 2, 800);
paddle.add(new THREE.Mesh(paddleGeometry, paddleMaterial));

const ballGeometry = new THREE.SphereGeometry(BALL_RADIUS, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const ball = new THREE.PointLight(0xff6666, 2, 800);
ball.add(new THREE.Mesh(ballGeometry, ballMaterial));

let blocks: THREE.Mesh[] = [];
const ballSpeed = new THREE.Vector3(0.0, 0.0, 0);

let score = 0;

let isPaused = false;

const getRainbowColor = (total: number, i: number) =>
  new THREE.Color().setHSL(i / total, 1, 0.5);

const setupScene = () => {
  for (const block of blocks) scene.remove(block);
  blocks = [];
  scene.remove(paddle);
  scene.remove(ball);

  paddle.position.y = -2.5;
  scene.add(paddle);

  ball.position.y = -2.3;
  ballSpeed.set(MIN_BALL_SPEED, MIN_BALL_SPEED, 0);
  scene.add(ball);

  for (let i = 0; i < blockRows; i++) {
    const rowMaterial = new THREE.MeshStandardMaterial({
      color: getRainbowColor(blockRows, i),
      emissive: new THREE.Color(0x000000),
    });
    const a = (BLOCK_COLS - 1) / 2;
    for (let j = -a; j <= a; j++) {
      const block = new THREE.Mesh(
        new THREE.BoxGeometry(
          BLOCK_SIZE.width,
          BLOCK_SIZE.height,
          BLOCK_SIZE.depth,
        ),
        rowMaterial,
      );
      block.position.set(j * 0.6, 2.9 - i * BLOCK_SIZE.height + i * -0.1, 0);
      blocks.push(block);
      scene.add(block);
    }
  }
};

const endGame = (message: string) => {
  alert(message + " Your score: " + score);
  setupScene();
};

const BALL_ACCELERATION_FACTOR = 1.03;
const animate = () => {
  requestAnimationFrame(animate);
  if (isPaused) return;

  const { x: ballX, y: ballY } = ball.position;

  // Ball collision with walls
  if (ballX > 4.9 || ballX < -4.9) {
    ballSpeed.x *= -1;
  }
  if (ballY > 2.9) {
    ballSpeed.y *= -1;
  }

  // Ball collision with paddle
  if (
    ballY <= paddle.position.y + PADDLE_HEIGHT &&
    ballY >= paddle.position.y - PADDLE_HEIGHT &&
    ballX >= paddle.position.x - PADDLE_WIDTH / 2 &&
    ballX <= paddle.position.x + PADDLE_WIDTH / 2
  ) {
    ballSpeed.y *= -1;
    ball.position.y = paddle.position.y + PADDLE_HEIGHT;
  }

  // Ball movement
  ball.position.add(ballSpeed);

  // Ball collision with blocks
  blocks = blocks.filter((block) => {
    if (ball.position.distanceTo(block.position) < 0.3) {
      scene.remove(block);
      ballSpeed.y *= -1;
      ballSpeed.setLength(
        Math.min(
          MAX_BALL_SPEED,
          Math.max(
            MIN_BALL_SPEED,
            ballSpeed.length() * BALL_ACCELERATION_FACTOR,
          ),
        ),
      );
      return false;
    }
    return true;
  });

  speedElement.textContent = (ballSpeed.length() * 1e3).toFixed(2);
  score = blockRows * BLOCK_COLS - blocks.length;
  scoreElement.textContent = score.toString();

  renderer.render(scene, camera);

  if (blocks.length === 0) {
    endGame("You win!");
  } else if (ball.position.y < -3) {
    endGame("Game over!");
  }
};

const pause = () => {
  isPaused = !isPaused;
};

window.addEventListener("mousemove", (event) => {
  const x = (event.clientX / window.innerWidth) * 2 - 1;
  paddle.position.x = x * 4.5;
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "r":
      setupScene();
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

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const WALL_THICKNESS = 1.5;
const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0x222222,
  emissive: new THREE.Color(0x222222),
});
const wallGeometry = new THREE.BoxGeometry(WALL_THICKNESS * 2, 10);

const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
leftWall.position.set(-5 - WALL_THICKNESS, 0, 0);
scene.add(leftWall);

const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
rightWall.position.set(5 + WALL_THICKNESS, 0, 0);
scene.add(rightWall);

const topWallGeometry = new THREE.BoxGeometry(10, WALL_THICKNESS * 2);
const topWall = new THREE.Mesh(topWallGeometry, wallMaterial);
topWall.position.set(0, 3 + WALL_THICKNESS, 0);
scene.add(topWall);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.z = 5;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scoreElement = document.getElementById("score")!;
const speedElement = document.getElementById("speed")!;

const getRowsSetter = (calc: (rows: number) => number) => () => {
  blockRows = calc(blockRows);
  rowElement.textContent = blockRows.toString();
  setupScene();
};
const increaseRows = getRowsSetter((r) => r + 1);
const decreaseRows = getRowsSetter((r) => r - 1);

document.getElementById("reset")!.addEventListener("click", setupScene);
document.getElementById("pause")!.addEventListener("click", pause);
document.getElementById("plus-row")!.addEventListener("click", increaseRows);
document.getElementById("minus-row")!.addEventListener("click", decreaseRows);

setupScene();
animate();
