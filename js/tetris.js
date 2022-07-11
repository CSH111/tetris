"use strict";

import { BLOCKS } from "./block.js";
//DOM
const matrix = document.querySelector(".matrix ul");
//variables
let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;

const movingItem = {
  type: "blockS",
  direction: 0,
  top: 0,
  left: 4,
};
//init

init();
//function
function init() {
  tempMovingItem = { ...movingItem };
  prependRows();
  renderBlocks();
}
function prependRows() {
  for (let i = 0; i < 20; i++) {
    const row = document.createElement("li");
    makeNewRow(row);
    matrix.prepend(row);
  }
}
function makeNewRow(row) {
  const ul = document.createElement("ul");
  for (let i = 0; i < 10; i++) {
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

function renderBlocks(moveDirection = "", rotate = false) {
  const { type, direction, top, left } = tempMovingItem;

  removePreBlocks(type);
  BLOCKS[type][direction].some((cell) => {
    const x = cell[0] + left;
    const y = cell[1] + top;

    const target = matrix.childNodes[y]
      ? matrix.childNodes[y].childNodes[0].childNodes[x]
      : null;
    if (checkEmpty(target)) {
      target.classList.add(type, "moving");
    } else if (rotate === true) {
      adjustSideRotate(x, y);
    } else {
      tempMovingItem = { ...movingItem };
      setTimeout(() => {
        renderBlocks();

        if (moveDirection === "top") {
          stackBlocks();
        }
      }, 0);
      return true;
    }
  });
  movingItem.left = left;
  movingItem.top = top;
  movingItem.direction = direction;
}
function stackBlocks() {
  const blocksToStack = document.querySelectorAll(".moving");
  blocksToStack.forEach((cell) => {
    cell.classList.remove("moving");
    cell.classList.add("stacked");
  });
  movingItem.left = 4;
  movingItem.top = 0;
  movingItem.direction = 0;
  tempMovingItem = { ...movingItem };
  renderBlocks();
}
function checkEmpty(target) {
  if (!target || target.classList.contains("stacked")) {
    return false;
  } else {
    return true;
  }
}
function adjustSideRotate(x, y) {
  if (x < 0) {
    tempMovingItem.left += 1;
  } else {
    tempMovingItem.left -= 1;
  }
  if (y > matrix.childNodes.length - 1) {
    tempMovingItem.top -= 1;
  }
  setTimeout(() => {
    renderBlocks(), 0;
  });
}
// event
document.addEventListener("keydown", (event) => getKeyType(event));

function getKeyType(event) {
  switch (event.key) {
    case "ArrowRight":
      moveBlocks("left", 1);
      break;
    case "ArrowLeft":
      moveBlocks("left", -1);
      break;
    case "ArrowDown":
      moveBlocks("top", 1);
      break;
    case "z":
      rotateBlocks();
      break;
    default:
      break;
  }
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

//null undefined 등 의 값을 불리언 false로 바꾸는건 쉽지만 그런 null 값의 하위요소 존재여부를 불리언 false로 나타내기는 어려움 -> 그냥 에러떠버림!
