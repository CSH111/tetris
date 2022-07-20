"use strict";

import { BLOCKS } from "./block.js";
//DOM
const matrix = document.querySelector(".matrix ul");
const scoreBox = document.querySelector(".score");
const endScoreBox = document.querySelector(".endScore");

const startBtn = document.querySelector(".startBtn");
const gameTimer = document.querySelector(".gameTimer");

//variables
let milSec;
let sec;
let score;
let blockDownInterval;
let gameTimeInterval;
let movingItem;
let tempMovingItem;
let timeAlertState = false;
const rows = 22;
const columns = 10;

const initialItemSet = {
  type: `${PickRandomBlock()}`,
  direction: 0,
  top: 0,
  left: 4,
};

//init
init();

//funtions
function setInitialPosition() {
  movingItem = { ...initialItemSet };
}

function init() {
  createMatrix();
  setGameTimer();
  setInitialPosition();
  score = 0;
  [scoreBox, endScoreBox].forEach((box) => (box.innerHTML = score));

  startBtn.addEventListener("click", alertStart);
}

function generateNewBlock() {
  clearInterval(blockDownInterval);
  if (matrix.childNodes[1].innerHTML.includes("stacked")) {
    return;
  }
  autoDown(500);
  setInitialPosition();
  movingItem.type = `${PickRandomBlock()}`;
  renderBlocks();
}
function startGame(event) {
  tempMovingItem = { ...movingItem };
  // generateNewBlock();
  renderBlocks();
  autoDown(800);
  setKeydownEvent();
  runGameTimer();
  if (event) {
    event.target.disabled = true;
  }
}
function createMatrix() {
  for (let i = 0; i < rows; i++) {
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
  for (let i = 0; i < columns; i++) {
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
  BLOCKS[type][direction].some((cell) => {
    const x = cell[0] + left;
    const y = cell[1] + top;

    const target = matrix.childNodes[y]
      ? matrix.childNodes[y].childNodes[0].childNodes[x]
      : null;
    if (checkEmpty(target) === true) {
      target.classList.add(type, "moving");
    } else {
      preventRendering(moveDirection);
      return true;
    }
  });
  movingItem.left = left;
  movingItem.top = top;
  movingItem.direction = direction;
}
function preventRendering(moveDirection) {
  tempMovingItem = { ...movingItem };
  setTimeout(() => {
    renderBlocks();
    if (moveDirection === "top") {
      stackBlocks();
    }
  }, 0);
}

function checkEmpty(target) {
  if (!target || target.classList.contains("stacked")) {
    return false;
  }
  return true;
}

function stackBlocks() {
  const blocksToStack = document.querySelectorAll(".moving");
  blocksToStack.forEach((cell) => {
    cell.classList.remove("moving");
    cell.classList.add("stacked");
  });

  generateNewBlock();
  checkFullLines();
  checkGameOver();
}
function checkGameOver() {
  const lastLine = matrix.childNodes[2].firstChild.childNodes;
  Array.from(lastLine).some((cell) => {
    if (cell.classList.contains("stacked")) {
      gameOver();
      return true;
    }
  });
}
function gameOver() {
  toggleGameOverDisplay();
  stopGame();
  setRestartBtn();
}
function setRestartBtn() {
  const restartBtn = document.querySelector(".restart");
  restartBtn.addEventListener("click", restart);
}

//restart

function restart() {
  toggleGameOverDisplay();
  clearWarning();
  matrix.innerHTML = "";
  init();
  alertStart();
}
function toggleGameOverDisplay() {
  const gameOver = document.querySelector(".gameOver");
  gameOver.classList.toggle("show");
  gameOver;
}
function stopGame() {
  document.removeEventListener("keydown", onKeydown);
  clearInterval(blockDownInterval);
  clearInterval(gameTimeInterval);
}
function checkFullLines() {
  matrix.childNodes.forEach((row) => {
    const cellsArr = Array.from(row.firstChild.childNodes);
    if (cellsArr.every((cell) => cell.classList.contains("stacked"))) {
      removeFullLines(row);
    }
  });
}

function addGameTime() {
  sec += 5;
  // alertTimePlus();
  handleAlert();
}

function removeFullLines(row) {
  row.remove();
  prependNewRow();
  increaseScore();
  addGameTime();
}

function increaseScore() {
  score += 10;
  [scoreBox, endScoreBox].forEach((box) => (box.innerHTML = score));
}

function PickRandomBlock() {
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
  tempMovingItem.direction === 3
    ? (tempMovingItem.direction = 0)
    : (tempMovingItem.direction += 1);

  renderBlocks("", true);
}

function moveBlocks(moveDirection, amount) {
  tempMovingItem[moveDirection] += amount;
  renderBlocks(moveDirection);
}

function alertStart() {
  const startAlertBox = document.querySelector(".startAlertBox");
  startBtn.disabled = true;
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
  sec = 30;
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
      gameOver();
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
function clearWarning() {
  gameTimer.classList.remove("warning");
}

function handleAlert() {
  if (!timeAlertState) {
    alertTimePlus();
  } else {
    setTimeout(() => {
      alertTimePlus();
    }, 300);
  }
}

function alertTimePlus() {
  timeAlertState = true;
  const span = document.createElement("span");
  const box = document.querySelector(".timePlusAlert");
  span.textContent = "+5s";
  box.appendChild(span);
  const pr = new Promise((resolve, rej) => {
    setTimeout(() => {
      span.classList.add("up");
      timeAlertState = false;

      resolve();
    }, 50);
  });

  pr.then(() =>
    setTimeout(() => {
      span.remove();
    }, 1000)
  );
  setTimeout(() => {}, 500);
}

//null undefined 등 의 값을 불리언 false로 바꾸는건 쉽지만 그런 null 값의 하위요소 존재여부를 불리언 false로 나타내기는 어려움 -> 그냥 에러떠버림!

// rotate시 클래스를 stack, moving 두가지 갖고 있는 요소 좌표찾기
// (형제요소 중 몇번 쨰인지=>x좌표(구글 검색:js 몇 번째 자식))

//moving의 좌표와 stack+moving의 좌표를 비교 해서 좌로 뺼지 우로 뺄지 결정
//좌표비교 변경전 x좌표의합 vs 변경후 x좌표의 합

//rotate 후 겹치면 ->
// 겹친놈의 x좌표 보다 큰 갯수 작은 갯수 비교 후 좌, 우 결정

//rotate 예외 처리 - 구현ing...
function adjustRotate(target, x, y) {
  switch (checkEmpty(target)) {
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
//7. 시간 시각화?
//8.시간플러스 시각화 시 딜레이설정
//
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
