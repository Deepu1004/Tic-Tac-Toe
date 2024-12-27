const board = document.getElementById("board");
const message = document.querySelector(".message");
const resetBtn = document.querySelector(".reset-btn");
const modeBtns = document.querySelectorAll(".mode-btn");

let cells = [];
let currentPlayer = "X";
let gameMode = "2player";
let gameActive = true;

function initGame() {
  board.innerHTML = "";
  cells = [];
  currentPlayer = "X";
  gameActive = true;
  message.textContent = "X's turn";
  message.className = "message";

  // Create the game board
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("button");
    cell.classList.add("cell");
    cell.setAttribute("data-index", i);
    cell.addEventListener("click", () => handleCellClick(i));
    board.appendChild(cell);
    cells.push(cell);
  }
}

function handleCellClick(index) {
  if (!gameActive || cells[index].textContent !== "") return;

  makeMove(index);

  if (gameActive && gameMode === "ai" && currentPlayer === "O") {
    setTimeout(makeAIMove, 500);
  }
}

function makeMove(index) {
  if (!gameActive || cells[index].textContent !== "") return;

  cells[index].textContent = currentPlayer;
  cells[index].classList.add(currentPlayer.toLowerCase());

  if (checkWin()) {
    handleWin();
  } else if (checkDraw()) {
    handleDraw();
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    message.textContent = `${currentPlayer}'s turn`;
  }
}

function makeAIMove() {
  if (!gameActive) return;

  const availableMoves = cells
    .map((cell, index) => (cell.textContent === "" ? index : null))
    .filter((index) => index !== null);

  if (availableMoves.length > 0) {
    const bestMove = findBestMove();
    makeMove(bestMove);
  }
}

function findBestMove() {
  // Try to win
  const winMove = findWinningMove("O");
  if (winMove !== -1) return winMove;

  // Block opponent
  const blockMove = findWinningMove("X");
  if (blockMove !== -1) return blockMove;

  // Take center
  if (cells[4].textContent === "") return 4;

  // Take corners
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter((i) => cells[i].textContent === "");
  if (availableCorners.length > 0) {
    return availableCorners[
      Math.floor(Math.random() * availableCorners.length)
    ];
  }

  // Take any available space
  const available = cells
    .map((cell, index) => (cell.textContent === "" ? index : null))
    .filter((index) => index !== null);
  return available[Math.floor(Math.random() * available.length)];
}

function findWinningMove(player) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    const line = [
      cells[a].textContent,
      cells[b].textContent,
      cells[c].textContent,
    ];

    if (
      line.filter((cell) => cell === player).length === 2 &&
      line.includes("")
    ) {
      return pattern[line.indexOf("")];
    }
  }

  return -1;
}

function checkWin() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winPatterns.some((pattern) => {
    const [a, b, c] = pattern;
    return (
      cells[a].textContent &&
      cells[a].textContent === cells[b].textContent &&
      cells[a].textContent === cells[c].textContent
    );
  });
}

function checkDraw() {
  return cells.every((cell) => cell.textContent !== "");
}

function handleWin() {
  gameActive = false;
  const container = document.querySelector(".container");

  if (gameMode === "ai" && currentPlayer === "O") {
    message.textContent = "You lost!";
    message.className = "message winner-message red";
    container.classList.add("flash-red");
  } else {
    message.textContent = `${currentPlayer} wins!`;
    message.className = `message winner-message ${
      currentPlayer === "X" ? "blue" : "red"
    }`;
    container.classList.add(currentPlayer === "X" ? "flash-blue" : "flash-red");
  }

  setTimeout(() => {
    container.classList.remove("flash-blue", "flash-red");
  }, 1000);
}

function handleDraw() {
  gameActive = false;
  message.textContent = "It's a draw!";
  message.className = "message winner-message";
}

modeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.dataset.mode === gameMode) return;

    modeBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    gameMode = btn.dataset.mode;
    initGame();
  });
});

resetBtn.addEventListener("click", initGame);

// Initialize the game
initGame();
