let brands = [];

fetch("assets/data/brands.json")
  .then((res) => res.json())
  .then((data) => {
    brands = data;
    initiateGame();
  });

let correct = 0;
let total = 0;
const totalDraggableItems = 7;
const totalMatchingPairs = 5;

const scoreSection = document.querySelector(".score");
const correctSpan = scoreSection.querySelector(".correct");
const totalSpan = scoreSection.querySelector(".total");
const playAgainBtn = scoreSection.querySelector("#play-again-btn");

const draggableItems = document.querySelector(".draggable-items");
const matchingPairs = document.querySelector(".matching-pairs");
let draggableElements;
let droppableElements;

function initiateGame() {
  const randomDraggableBrands = generateRandomItemsArray(totalDraggableItems, brands);
  const randomDroppableBrands = generateRandomItemsArray(totalMatchingPairs, randomDraggableBrands);
  const sortedDroppableBrands = [...randomDroppableBrands].sort((a, b) =>
    a.brandName.localeCompare(b.brandName)
  );

  for (let brand of randomDraggableBrands) {
    draggableItems.insertAdjacentHTML(
      "beforeend",
      `<img src="${brand.iconName}" class="draggable" draggable="true" id="${brand.iconName}">`
    );
  }

  for (let brand of sortedDroppableBrands) {
    matchingPairs.insertAdjacentHTML(
      "beforeend",
      `<div class="matching-pair">
         <span class="label" data-brand="${brand.iconName}">${brand.brandName}</span>
         <span class="droppable" data-brand="${brand.iconName}"></span>
       </div>`
    );
  }

  draggableElements = document.querySelectorAll(".draggable");
  droppableElements = document.querySelectorAll(".droppable");

  draggableElements.forEach((elem) => {
    elem.addEventListener("dragstart", dragStart);
    elem.addEventListener("touchstart", touchStart, { passive: false });
  });

  const validDropZones = document.querySelectorAll(".droppable, .label");

  validDropZones.forEach((elem) => {
    elem.addEventListener("dragenter", dragEnter);
    elem.addEventListener("dragover", dragOver);
    elem.addEventListener("dragleave", dragLeave);
    elem.addEventListener("drop", drop);
  });

  document.addEventListener("touchmove", touchMove, { passive: false });
  document.addEventListener("touchend", touchEnd);
}

// Mouse events
function dragStart(e) {
  e.dataTransfer.setData("text", e.target.id);
}

function dragEnter(e) {
  const dropZone = getDropTarget(e.target);
  if (dropZone && !dropZone.classList.contains("dropped")) {
    dropZone.classList.add("droppable-hover");
  }
}
function dragOver(e) {
  const dropZone = getDropTarget(e.target);
  if (dropZone && !dropZone.classList.contains("dropped")) {
    e.preventDefault();
  }
}
function dragLeave(e) {
  const dropZone = getDropTarget(e.target);
  if (dropZone) {
    dropZone.classList.remove("droppable-hover");
  }
}
function drop(e) {
  e.preventDefault();
  const dropZone = getDropTarget(e.target);
  if (!dropZone || dropZone.classList.contains("dropped")) return;

  dropZone.classList.remove("droppable-hover");
  const draggableId = e.dataTransfer.getData("text");
  processMatch(draggableId, dropZone);
}

function getDropTarget(element) {
  if (element.classList.contains("droppable")) return element;
  if (element.classList.contains("label")) {
    const parent = element.closest(".matching-pair");
    return parent?.querySelector(".droppable");
  }
  return null;
}

// Touch events
let touchDraggedElement = null;

function touchStart(e) {
  if (!e.target.classList.contains("draggable") || e.target.classList.contains("dragged")) return;

  touchDraggedElement = e.target.cloneNode(true);
  touchDraggedElement.style.position = "absolute";
  touchDraggedElement.style.zIndex = "1000";
  touchDraggedElement.style.pointerEvents = "none";
  touchDraggedElement.classList.add("touch-dragging");

  document.body.appendChild(touchDraggedElement);
  moveAt(e.touches[0].pageX, e.touches[0].pageY);
  e.preventDefault();
}

function touchMove(e) {
  if (touchDraggedElement) {
    moveAt(e.touches[0].pageX, e.touches[0].pageY);
    e.preventDefault();
  }
}

function touchEnd(e) {
  if (!touchDraggedElement) return;

  const touch = e.changedTouches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  const dropZone = getDropTarget(target);

  if (dropZone && !dropZone.classList.contains("dropped")) {
    const draggedId = touchDraggedElement.id;
    processMatch(draggedId, dropZone);
  }

  touchDraggedElement.remove();
  touchDraggedElement = null;
}

function moveAt(x, y) {
  touchDraggedElement.style.left = x - touchDraggedElement.offsetWidth / 2 + "px";
  touchDraggedElement.style.top = y - touchDraggedElement.offsetHeight / 2 + "px";
}

// Core logic
function processMatch(draggableId, dropTarget) {
  const expectedId = dropTarget.getAttribute("data-brand");
  total++;

  if (draggableId === expectedId) {
    const realDraggable = document.getElementById(draggableId);
    dropTarget.classList.add("dropped");
    realDraggable.classList.add("dragged");
    realDraggable.setAttribute("draggable", "false");
    dropTarget.innerHTML = `<img src="${realDraggable.src}">`;
    correct++;
  }

  updateScore();
  checkGameEnd();
}

function updateScore() {
  scoreSection.style.opacity = 0;
  setTimeout(() => {
    correctSpan.textContent = correct;
    totalSpan.textContent = total;
    scoreSection.style.opacity = 1;
  }, 200);
}

function checkGameEnd() {
  if (correct === Math.min(totalMatchingPairs, totalDraggableItems)) {
    playAgainBtn.style.display = "block";
    setTimeout(() => {
      playAgainBtn.classList.add("play-again-btn-entrance");
    }, 200);
  }
}

playAgainBtn.addEventListener("click", () => {
  playAgainBtn.classList.remove("play-again-btn-entrance");
  correct = 0;
  total = 0;
  draggableItems.style.opacity = 0;
  matchingPairs.style.opacity = 0;
  setTimeout(() => {
    playAgainBtn.style.display = "none";
    draggableItems.innerHTML = "";
    matchingPairs.innerHTML = "";
    initiateGame();
    updateScore();
    draggableItems.style.opacity = 1;
    matchingPairs.style.opacity = 1;
  }, 500);
});

function generateRandomItemsArray(n, originalArray) {
  let res = [];
  let copy = [...originalArray];
  n = Math.min(n, copy.length);
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    res.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return res;
}
