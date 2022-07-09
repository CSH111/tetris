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
    [],
    [],
    [],
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

function renderBlocks() {
  const { type, direction, top, left } = tempMovingItem;
  const previousTarget = document.querySelectorAll(`.${type}`);
  previousTarget.forEach((cell) => {
    cell.classList.remove(type);
  });

  BLOCKS[type][direction].forEach((cell) => {
    const x = cell[0] + left;
    const y = cell[1] + top;

    const target = matrix.childNodes[y]
      ? matrix.childNodes[y].childNodes[0].childNodes[x]
      : null;
    if (target) {
      target.classList.add(type);
    } else {
      tempMovingItem = { ...movingItem };
      setTimeout(() => {
        renderBlocks(), 0;
      });
    }
  });
  movingItem.left = left;
  movingItem.top = top;
  movingItem.direction = direction;
}

// event
document.addEventListener("keydown", (event) => getKeyType(event));

function getKeyType(event) {
  switch (event.keyCode) {
    case 39:
      moveBlock("left", 1);
      break;
    case 37:
      moveBlock("left", -1);

      break;
    case 38:
      moveBlock("top", -1);
      4;

      break;
    case 40:
      moveBlock("top", 1);
      break;

    default:
      break;
  }
}
function moveBlock(moveDirection, amount) {
  tempMovingItem[moveDirection] += amount;
  renderBlocks();
}

//null undefined 등 의 값을 불리언 false로 바꾸는건 쉽지만 그런 null 값의 하위요소 존재여부를 불리언 false로 나타내기는 어려움 -> 그냥 에러떠버림!
