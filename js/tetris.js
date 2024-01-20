"use strict";

import { BLOCKS } from "./block.js";
//DOM
const matrix = document.querySelector(".matrix ul");
const scoreDOM = document.querySelector(".score");
const endScoreBox = document.querySelector(".endScore");

const startBtn = document.querySelector(".startBtn");
const gameTimer = document.querySelector(".gameTimer");

//variables
let milSec;
let sec;
let score;
let blockDownInterval;
const BLOCK_DOWN_INTERVAL_TIME = 700;
let gameTimeInterval;
let movingItem;
let tempMovingItem;
let timeAlertCount = 0;
const ROW_AMOUNT = 22;
const COLUMN_AMOUNT = 10;
const GAME_TIME = 30;

//init
init();

//funtions
function createInitialBlockObj() {
  return {
    type: `${pickRandomBlock()}`,
    direction: 0,
    top: 0,
    left: 4,
  };
}

function setInitialPosition() {
  movingItem = createInitialBlockObj();
}

function init() {
  createMatrix();
  setGameTimer();
  setInitialPosition();
  score = 0;
  [scoreDOM, endScoreBox].forEach((box) => (box.innerHTML = score));

  startBtn.addEventListener("click", alertStart);
}

function generateNewBlock() {
  if (matrix.childNodes[2].innerHTML.includes("stacked")) {
    return;
  }
  setInitialPosition();
  tempMovingItem = { ...movingItem };

  renderBlocks();
  autoDown(BLOCK_DOWN_INTERVAL_TIME);
}

function startGame(event) {
  tempMovingItem = { ...movingItem };
  renderBlocks();
  autoDown(BLOCK_DOWN_INTERVAL_TIME);
  setKeydownEvent();
  runGameTimer();
  if (event) {
    event.target.disabled = true;
  }
}
function createMatrix() {
  for (let i = 0; i < ROW_AMOUNT; i++) {
    prependNewRow();
  }
}
function prependNewRow() {
  const row = document.createElement("li");
  setNewRow(row);
  matrix.prepend(row);
}

function setNewRow(row) {
  const ul = document.createElement("ul");
  for (let i = 0; i < COLUMN_AMOUNT; i++) {
    const column = document.createElement("li");
    ul.prepend(column);
  }
  row.prepend(ul);
}

function removePreBlocks(type) {
  const previousTarget = document.querySelectorAll(".moving");
  previousTarget.forEach((cell) => {
    cell.classList.remove(type, "moving");
  });
}

function renderBlocks(moveDirection = "", rotate = "") {
  const { type, direction, top, left } = tempMovingItem;
  removePreBlocks(type);
  if (
    BLOCKS[type][direction].every(([posX, posY]) => {
      const [x, y] = [posX + left, posY + top];
      const targetPosition = matrix.childNodes[y]?.childNodes[0].childNodes[x];
      return isEmptyPosition(targetPosition);
    })
  ) {
    BLOCKS[type][direction].forEach(([posX, posY]) => {
      const [x, y] = [posX + left, posY + top];
      const targetPosition = matrix.childNodes[y]?.childNodes[0].childNodes[x];
      targetPosition.classList.add(type, "moving");
    });

    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
    return;
  }
  preventRendering(moveDirection);
}

function preventRendering(moveDirection) {
  tempMovingItem = { ...movingItem };
  renderBlocks();
  if (moveDirection === "top") {
    stackBlocks();
  }
}

function isEmptyPosition(target) {
  if (!target || target.classList.contains("stacked")) {
    return false;
  }
  return true;
}

async function stackBlocks() {
  const blocksToStack = document.querySelectorAll(".moving");
  blocksToStack.forEach((cell) => {
    cell.classList.remove("moving");
    cell.classList.add("stacked");
  });
  clearInterval(blockDownInterval);
  blockDownInterval = null;

  await checkFullLines();
  generateNewBlock();
  checkGameOver();
}

function checkGameOver() {
  const lastLine = matrix.childNodes[2].firstChild.childNodes;
  Array.from(lastLine).some((cell) => {
    if (cell.classList.contains("stacked")) {
      quitGame();
      return true;
    } else {
    }
  });
}
function quitGame() {
  toggleGameOverDisplay();
  document.removeEventListener("keydown", onKeydown);
  clearInterval(blockDownInterval);
  clearInterval(gameTimeInterval);
  setRestartBtn();
}

function setRestartBtn() {
  const restartBtn = document.querySelector(".restart");
  restartBtn.addEventListener("click", restart);
}

//restart

function restart() {
  matrix.innerHTML = "";
  toggleGameOverDisplay();
  clearTimeWarningColor();
  init();
  alertStart();
}
function toggleGameOverDisplay() {
  const gameOver = document.querySelector(".gameOver");
  gameOver.classList.toggle("show");
}

async function checkFullLines() {
  const promises = Array.from(matrix.childNodes).map(async (row) => {
    const cellsArr = Array.from(row.firstChild.childNodes);
    if (cellsArr.every((cell) => cell.classList.contains("stacked"))) {
      await clearFullLine(row);
      prependNewRow();
      increaseScore();
      addGameTime();
    }
  });

  await Promise.all(promises);
}

function addGameTime() {
  sec += 5;
  adjustTimePlusAlert();
}

function blink(row, time) {
  row.classList.toggle("blink");
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function clearFullLine(row) {
  await blink(row, 300);
  row.remove();
}

function increaseScore() {
  score += 10;
  [scoreDOM, endScoreBox].forEach((box) => (box.innerHTML = score));
}

function pickRandomBlock() {
  const randomNumber = Math.floor(Math.random() * Object.keys(BLOCKS).length);
  return Object.keys(BLOCKS)[randomNumber];
}

function autoDown(intervalTime) {
  blockDownInterval = setInterval(() => {
    moveBlocks("top", 1);
  }, intervalTime);
}

// event
function setKeydownEvent() {
  document.addEventListener("keydown", onKeydown);
}
function onKeydown(event) {
  switch (event.keyCode) {
    case 39: // ArrowRight
      moveBlocks("left", 1);
      break;
    case 37: // ArrowLeft
      moveBlocks("left", -1);
      break;
    case 40: // ArrowDown
      moveBlocks("top", 1);
      break;
    case 38: // ArrowUp
    case 90: // z
      rotateBlocks();
      break;
    case 32: // space
      quickDown();

      break;
    default:
      break;
  }
}
function quickDown() {
  clearInterval(blockDownInterval);
  autoDown(5);
}

function rotateBlocks() {
  if (!blockDownInterval) return;
  tempMovingItem.direction === 3 ? (tempMovingItem.direction = 0) : (tempMovingItem.direction += 1);

  renderBlocks("", true);
}

function moveBlocks(moveDirection, amount) {
  if (!blockDownInterval) return;
  tempMovingItem[moveDirection] += amount;
  renderBlocks(moveDirection);
}

function alertStart() {
  const startAlertBox = document.querySelector(".startAlertBox");
  startBtn.classList.add("hidden");
  startAlertBox.innerHTML = "READY";
  startAlertBox.classList.add("show");
  setTimeout(() => {
    startAlertBox.innerHTML = "GO!";
    removeAlertBox(startAlertBox);
  }, 1000);
}
function removeAlertBox(startAlertBox) {
  setTimeout(() => {
    startAlertBox.classList.remove("show");
    startGame();
  }, 500);
}

function setGameTimer() {
  sec = GAME_TIME;
  milSec = 0;
  gameTimer.lastElementChild.innerHTML = padZero(milSec);
  gameTimer.firstElementChild.innerHTML = padZero(sec);
}

function runGameTimer() {
  gameTimeInterval = setInterval(() => {
    milSec--;
    if (milSec < 0) {
      sec--;
      milSec = 99;
    }
    if (milSec === 0 && sec === 0) {
      quitGame();
      clearInterval(gameTimeInterval);
    }
    gameTimer.lastElementChild.innerHTML = padZero(milSec);
    gameTimer.firstElementChild.innerHTML = padZero(sec);

    if (sec < 5 && !gameTimer.classList.contains("warning")) {
      gameTimer.classList.add("warning");
    }
    if (sec >= 5 && gameTimer.classList.contains("warning")) {
      gameTimer.classList.remove("warning");
    }
  }, 10);
}
function padZero(number) {
  return String(number).padStart(2, "0");
}
function clearTimeWarningColor() {
  gameTimer.classList.remove("warning");
}

function adjustTimePlusAlert() {
  timeAlertCount += 1;
  setTimeout(() => {
    alertTimePlus();
  }, 300 * (timeAlertCount - 1));
}

function alertTimePlus() {
  const span = document.createElement("span");
  span.textContent = "+5s";
  const box = document.querySelector(".timePlusAlert");
  box.appendChild(span);
  setTimeout(() => {
    span.remove();
    timeAlertCount -= 1;
  }, 1500);
}

// rotate시 클래스를 stack, moving 두가지 갖고 있는 요소 좌표찾기
// (형제요소 중 몇번 쨰인지=>x좌표(구글 검색:js 몇 번째 자식))

//moving의 좌표와 stack+moving의 좌표를 비교 해서 좌로 뺼지 우로 뺄지 결정
//좌표비교 변경전 x좌표의합 vs 변경후 x좌표의 합

//rotate 후 겹치면 ->
// 겹친놈의 x좌표 보다 큰 갯수 작은 갯수 비교 후 좌, 우 결정

//rotate 예외 처리 - 구현ing...
function adjustRotate(target, x, y) {
  switch (isEmptyPosition(target)) {
    case "outOfMatrix":
      console.log("out");
      if (x < 0) {
        tempMovingItem.left += 1;
      } else if (x > 9) {
        tempMovingItem.left -= 1;
      } else if (y > 19) {
        tempMovingItem.top -= 1;
      }

      addAdjustStack("outOfMatrix");
      restoreBlockDirection();
      break;
    case "alredyCharged":
      const overlappedBlocks = document.querySelectorAll(".moving.stacked");

      console.log(getXIndex(target));

      console.log("charged");
      // tempMovingItem.left -= 1;

      //
      addAdjustStack("charged");
      restoreBlockDirection();
      break;
  }
  setTimeout(() => {
    renderBlocks("", true);
  }, 0);
  // adjustRotate(target, x, y);
  // return adjustRotate(target, x, y);
}
function addAdjustStack(error) {
  if (!adjustStack.includes(error)) {
    adjustStack.push(error);
  }
}
function restoreBlockDirection() {
  if (adjustStack.length === 2) {
    adjustStack.splice(0);

    if (tempMovingItem.direction === 0) {
      tempMovingItem.direction = 3;
      return;
    }
    tempMovingItem.direction -= 1;
  }
}
function getXIndex(element) {
  let i = 0;
  while (element.previousElementSibling != null) {
    element = element.previousElementSibling;
    i++;
  }
  console.log(i);
  return i;
}

//할거
//
//- 게임기능
// 1. 점수
// 3. 내릴 장소 인디케이트(shoot preview)
// 4. 자유로운 rotate 구현
//6. 블록 올라오기
//  7. 로직 프로미스화

//- UI
// 1.가이드
// 2. 하루동안 안보기
//
//- 부가기능
// 1. 랭킹
// 2. 캡쳐 및 공유

//생성 혹은 이동에 디바운싱 넣어야 할듯?
//인트로
//모달 가이드
