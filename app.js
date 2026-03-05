const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelectorAll(".score");
const highScoreElement = document.querySelectorAll(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5,
  snakeY = 5;
let velocityX = 0,
  velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

const boardSize = 30;
const totalCells = boardSize * boardSize;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement[0].innerText = `High Score : ${highScore}`;
highScoreElement[1].innerText = `High Score : ${highScore}`;

const toggleModal = (isWin = false) => {
  const bodyClassList = document.body.classList;

  if (isWin) {
    document.querySelector(".modal h2").innerText = "🎉 승리!";
    document.querySelector(".modal p").innerText = "보드를 모두 채웠습니다!";
  }

  if (bodyClassList.contains("open")) {
    bodyClassList.remove("open");
    bodyClassList.add("closed");
    location.reload();
  } else {
    bodyClassList.remove("closed");
    bodyClassList.add("open");
  }
};

const updateFoodPosition = () => {
  let newFoodX, newFoodY;
  let isOnSnake;

  do {
    newFoodX = Math.floor(Math.random() * boardSize) + 1;
    newFoodY = Math.floor(Math.random() * boardSize) + 1;

    isOnSnake = snakeBody.some(
      (segment) => segment[0] === newFoodX && segment[1] === newFoodY,
    );
  } while (isOnSnake);

  foodX = newFoodX;
  foodY = newFoodY;
};

const handleGameOver = () => {
  clearInterval(setIntervalId);
  toggleModal(false);
};

const changeDirection = (e) => {
  if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  }
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  }
  if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
  if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  }
};

controls.forEach((button) => {
  button.addEventListener("click", () => {
    changeDirection({ key: button.dataset.key });
  });
});

const initGame = () => {
  if (gameOver) return handleGameOver();

  let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  if (snakeX === foodX && snakeY === foodY) {
    snakeBody.push([foodX, foodY]);
    score++;

    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);

    scoreElement[0].innerText = `Score : ${score}`;
    scoreElement[1].innerText = `Score : ${score}`;
    highScoreElement[0].innerText = `High Score : ${highScore}`;
    highScoreElement[1].innerText = `High Score : ${highScore}`;

    if (snakeBody.length === totalCells) {
      clearInterval(setIntervalId);
      toggleModal(true);
      return;
    }

    updateFoodPosition();
  }

  snakeX += velocityX;
  snakeY += velocityY;

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY];

  if (snakeX <= 0 || snakeX > boardSize || snakeY <= 0 || snakeY > boardSize) {
    gameOver = true;
  }

  for (let i = 0; i < snakeBody.length; i++) {
    html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

    if (
      i !== 0 &&
      snakeBody[0][0] === snakeBody[i][0] &&
      snakeBody[0][1] === snakeBody[i][1]
    ) {
      gameOver = true;
    }
  }

  playBoard.innerHTML = html;
};

updateFoodPosition();
setIntervalId = setInterval(initGame, 120);
document.addEventListener("keyup", changeDirection);
