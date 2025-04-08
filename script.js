// =========================
// GLOBAL VARIABLES
// =========================
let brands = [];
let correct = 0;
let total = 0;
let score = 0;
let timeLeft = 120;
const totalTime = 120;
const totalDraggableItems = 7;
const totalMatchingPairs = 5;

let gameTimer;
let gameOver = false;
let draggableElements;
let droppableElements;
let touchDraggedElement = null;
let touchMoved = false;

// DOM ELEMENTS
const scoreSection = document.querySelector(".score");
const correctSpan = scoreSection.querySelector(".correct");
const totalSpan = scoreSection.querySelector(".total");
const playAgainBtn = scoreSection.querySelector("#play-again-btn");
const gameOverBtn = document.getElementById("game-over-btn");

const draggableItems = document.querySelector(".draggable-items");
const matchingPairs = document.querySelector(".matching-pairs");

const imageModal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const modalOverlay = document.querySelector('.modal-overlay');
const liveScoreEl = document.getElementById("live-score");

const endScreen = document.getElementById("end-screen");
const endMessage = document.getElementById("end-message");
const endStats = document.getElementById("end-stats");
const restartBtn = document.getElementById("restart-btn");

// =========================
// GAME INITIALIZATION
// =========================
fetch("assets/data/brands.json")
    .then((res) => res.json())
    .then((data) => {
        brands = data;
        initiateGame();
    });

function initiateGame() {
    gameOver = false;
    timeLeft = totalTime;
    startGameTimer();

    const randomDraggableBrands = generateRandomItemsArray(totalDraggableItems, brands);
    const randomDroppableBrands = generateRandomItemsArray(totalMatchingPairs, randomDraggableBrands);
    const sortedDroppableBrands = [...randomDroppableBrands].sort((a, b) =>
        a.brandName.localeCompare(b.brandName)
    );

    // Create draggable elements
    for (let brand of randomDraggableBrands) {
        draggableItems.insertAdjacentHTML(
            "beforeend",
            `<img src="${brand.iconName}" class="draggable" draggable="true" id="${brand.iconName}">`
        );
    }

    // Create droppable areas
    for (let brand of sortedDroppableBrands) {
        matchingPairs.insertAdjacentHTML(
            "beforeend",
            `<div class="matching-pair">
         <span class="label" data-brand="${brand.iconName}">${brand.brandName}</span>
         <span class="droppable" data-brand="${brand.iconName}"></span>
       </div>`
        );
    }

    // Set up drag and touch events
    draggableElements = document.querySelectorAll(".draggable");
    droppableElements = document.querySelectorAll(".droppable");

    draggableElements.forEach((elem) => {
        elem.addEventListener("dragstart", dragStart);
        elem.addEventListener("touchstart", touchStart, { passive: false });

        elem.addEventListener("click", () => openImageModal(elem.src));
        elem.addEventListener("touchend", (e) => {
            if (!touchMoved && !elem.classList.contains("dragged")) {
                openImageModal(elem.src);
            }
        });
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

// =========================
// IMAGE MODAL
// =========================
function openImageModal(src) {
    modalImg.src = src;
    imageModal.classList.add("visible");
}

function closeImageModal() {
    imageModal.classList.add("closing");

    setTimeout(() => {
        imageModal.classList.remove("visible", "closing");
        modalImg.src = "";
    }, 300);
}

modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
        closeImageModal();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeImageModal();
    }
});

// =========================
// TIMER
// =========================
function startGameTimer() {
    clearTimeout(gameTimer);
    const timerDisplay = document.getElementById("game-timer");
    timeLeft = totalTime;

    updateTimerDisplay(timeLeft, timerDisplay);
    updateTimerVisual(timeLeft, timerDisplay);

    gameTimer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            disableGame();
            timerDisplay.textContent = "0:00";
            showEndScreen(false); // perdió
            return;
        }

        timeLeft--;
        updateTimerDisplay(timeLeft, timerDisplay);
        updateTimerVisual(timeLeft, timerDisplay);
        updateLiveScore();
    }, 1000);
}

function updateTimerDisplay(seconds, element) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    element.textContent = `${mins}:${secs < 10 ? "0" + secs : secs}`;
}

function updateTimerVisual(seconds, element) {
    if (seconds <= 30) {
        element.style.fontWeight = "bold";
        element.style.color = seconds % 2 === 0 ? "#b00020" : "#000000";
    } else {
        element.style.fontWeight = "bold";
        element.style.color = "#111";
    }
}

function disableGame() {
    draggableElements.forEach((el) => {
        el.setAttribute("draggable", "false");
        el.classList.add("dragged");
    });
}

// =========================
// DRAG & DROP EVENTS
// =========================
function dragStart(e) {
    if (gameOver) return;
    e.dataTransfer.setData("text", e.target.id);
}

function dragEnter(e) {
    if (gameOver) return;
    const dropZone = getDropTarget(e.target);
    if (dropZone && !dropZone.classList.contains("dropped")) {
        dropZone.classList.add("droppable-hover");
    }
}

function dragOver(e) {
    if (gameOver) return;
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
    if (gameOver) return;
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

// =========================
// TOUCH EVENTS
// =========================
function touchStart(e) {
    if (gameOver || !e.target.classList.contains("draggable") || e.target.classList.contains("dragged")) return;

    touchMoved = false;

    if (e.touches.length > 1) return;

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
        touchMoved = true;
        moveAt(e.touches[0].pageX, e.touches[0].pageY);
        e.preventDefault();
    }
}

function touchEnd(e) {
    if (!touchDraggedElement) return;

    if (!touchMoved) {
        openImageModal(touchDraggedElement.src);
    } else {
        const touch = e.changedTouches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        const dropZone = getDropTarget(target);

        if (!gameOver && dropZone && !dropZone.classList.contains("dropped")) {
            const draggedId = touchDraggedElement.id;
            processMatch(draggedId, dropZone);
        }
    }

    touchDraggedElement.remove();
    touchDraggedElement = null;
}

function moveAt(x, y) {
    touchDraggedElement.style.left = x - touchDraggedElement.offsetWidth / 2 + "px";
    touchDraggedElement.style.top = y - touchDraggedElement.offsetHeight / 2 + "px";
}

// =========================
// MATCHING LOGIC
// =========================
function processMatch(draggableId, dropTarget) {
    if (gameOver) return;

    const realDraggable = document.getElementById(draggableId);
    if (realDraggable.classList.contains("dragged")) return;

    const expectedId = dropTarget.getAttribute("data-brand");
    total++;

    if (draggableId === expectedId) {
        dropTarget.classList.add("dropped");
        realDraggable.classList.add("dragged");
        realDraggable.setAttribute("draggable", "false");
        dropTarget.innerHTML = `<img src="${realDraggable.src}">`;
        correct++;
    } else {
        const timeFactor = timeLeft / totalTime;
        let mistakes = total - correct;
        const penalty = Math.floor((300 + mistakes * 75) * timeFactor);
        score = Math.max(0, score - penalty);
    }

    updateScore();
    updateLiveScore();
    checkGameEnd();
}

// =========================
// SCORE & GAME END
// =========================
function updateScore() {
    scoreSection.style.opacity = 0;

    setTimeout(() => {
        correctSpan.textContent = correct;
        totalSpan.textContent = total;
        scoreSection.style.opacity = 1;

        updateLiveScore();
    }, 200);
}

function updateLiveScore() {
    const calculated = calculateLiveScore(correct, total, timeLeft, totalTime);
    liveScoreEl.textContent = `Puntaje: ${calculated}`;
}

function calculateLiveScore(correct, total, timeLeft, totalTime) {
    const accuracy = correct / (total || 1);
    const multiplier = timeLeft / totalTime;
    const score = Math.floor((correct * 10 + accuracy * 5) * multiplier * totalTime);
    return Math.max(0, score);
}

function checkGameEnd() {
    if (correct === Math.min(totalMatchingPairs, totalDraggableItems)) {
        clearTimeout(gameTimer);
        showEndScreen(true); // ganó
    }
}

async function showEndScreen(won) {
    gameOver = true;
  
    const finalScore = calculateLiveScore(correct, total, timeLeft, totalTime);
    const hash = await generateScoreHash(correct, total, timeLeft, finalScore);
  
    let message = "";
    let themeColor = won ? "#007bff" : "#b00020";
  
    if (!won) {
      message = "¡Mejor suerte la próxima!";
      themeColor = "#b00020";
    } else if (correct === 5 && total === 5) {
      message = "¡Puntaje perfecto! ¡Excelente trabajo!";
    } else if (total - correct <= 2) {
      message = "¡Lo hiciste genial!";
    } else {
      message = "¡Bien jugado! ¡Lograste terminar!";
    }
  
    endMessage.textContent = message;
    endMessage.style.color = themeColor;
  
    endStats.innerHTML = `
      <div class="stats-container">
        <div class="stat-card">
          <span class="stat-label">Puntaje</span>
          <span class="stat-value">${finalScore}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Correctas</span>
          <span class="stat-value">${correct}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Intentos</span>
          <span class="stat-value">${total}</span>
        </div>
      </div>
    `;
  
    // 🔧 Eliminar ID anterior si existe
    const existingHash = endScreen.querySelector(".game-id");
    if (existingHash) {
      existingHash.remove();
    }
  
    // 🔐 Agregar el nuevo ID de partida
    const hashDisplay = document.createElement("div");
    hashDisplay.classList.add("game-id");
    hashDisplay.textContent = `${hash}`;
    endScreen.querySelector(".end-screen-content").appendChild(hashDisplay);
  
    endScreen.classList.remove("hidden");
  }
  
  

// =========================
// PLAY AGAIN BUTTON
// =========================
restartBtn.addEventListener("click", () => {
    endScreen.classList.add("hidden");

    correct = 0;
    total = 0;
    timeLeft = totalTime;
    document.getElementById("live-score").textContent = "Puntaje: 0";

    draggableItems.innerHTML = "";
    matchingPairs.innerHTML = "";

    initiateGame();
    updateScore();
});

// =========================
// UTILITY
// =========================
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



async function generateScoreHash(correct, total, timeLeft, score) {
    const rawData = `${correct}-${total}-${timeLeft}-${score}`;
    const msgBuffer = new TextEncoder().encode(rawData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}