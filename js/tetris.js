"use strict";
//DOM
const matrix = document.querySelector(".matrix ul");

//variables
let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;

const BLOCKS = {
  tree: [
    [
      [2, 1],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 1],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
      [0, 1],
    ],
  ],
};

const movingItem = {
  type: "tree",
  direction: 0,
  top: 0,
  left: 0,
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

function renderBlocks(moveDirection = "", rotate = false) {
  const { type, direction, top, left } = tempMovingItem;
  const previousTarget = document.querySelectorAll(`.${type}`);
  previousTarget.forEach((cell) => {
    cell.classList.remove(type);
  });

  BLOCKS[type][direction].some((cell) => {
    const x = cell[0] + left;
    const y = cell[1] + top;

    const target = matrix.childNodes[y]
      ? matrix.childNodes[y].childNodes[0].childNodes[x]
      : null;
    if (target) {
      target.classList.add(type);
    } else if (rotate === true) {
      adjustSideRotate(x);
    } else {
      tempMovingItem = { ...movingItem };
      setTimeout(() => {
        renderBlocks();
        if (moveDirection === "top") console.log("stacked!"), 0; //check stacked
      });
      return true;
    }
  });
  movingItem.left = left;
  movingItem.top = top;
  movingItem.direction = direction;
}
function adjustSideRotate(x) {
  if (x < 0) {
    tempMovingItem.left += 1;
  } else {
    tempMovingItem.left -= 1;
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
