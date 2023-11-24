const gridSize = 4;
let board = [];
let score = 0;
let gameActive = true;

function newGame() {
  gameActive = true;
  score = 0;
  document.getElementById("game-over-overlay").style.display = "none";
  document.getElementById("new-game-button").style.display = "none";

  board = [];
  for (let i = 0; i < gridSize; i++) {
    board.push(new Array(gridSize).fill(0));
  }
  addRandomTile();
  addRandomTile();
  drawBoard();
}

function addRandomTile() {
  let emptyTiles = [];
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (board[i][j] === 0) {
        emptyTiles.push({ x: i, y: j });
      }
    }
  }
  if (emptyTiles.length > 0) {
    let randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[randomTile.x][randomTile.y] = Math.random() < 0.9 ? 2 : 4;
  }
}

function drawBoard() {
  const boardContainer = document.getElementById("board");
  boardContainer.innerHTML = "";
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      const value = board[i][j];
      tile.textContent = value > 0 ? value : "";
      if (value > 0) {
        tile.classList.add(`tile-${value}`);
      }
      boardContainer.appendChild(tile);
    }
  }
}

function move(direction) {
  if (!gameActive) return;
  let moved = false;
  let newBoard = copyBoard(board);

  if (["left", "right"].includes(direction)) {
    newBoard = moveRows(newBoard, direction);
  } else if (["up", "down"].includes(direction)) {
    newBoard = moveColumns(newBoard, direction);
  }

  if (!boardsEqual(board, newBoard)) {
    board = newBoard;
    addRandomTile();
    moved = true;

    if (isGameOver()) {
      gameActive = false;
      document.getElementById("game-over-overlay").style.display = "flex";
      document.getElementById("new-game-button").style.display = "block";
    }
  }

  if (moved) {
    drawBoard();
  }
  window.board = board;
}

function moveRows(board, direction) {
  return board.map((row) => {
    let newRow = direction === "right" ? row.slice().reverse() : row.slice();
    newRow = moveTiles(newRow);
    return direction === "right" ? newRow.reverse() : newRow;
  });
}

function moveColumns(board, direction) {
  let newBoard = copyBoard(board);
  for (let j = 0; j < gridSize; j++) {
    let col = newBoard.map((row) => row[j]);
    if (direction === "down") {
      col.reverse();
    }
    col = moveTiles(col);
    if (direction === "down") {
      col.reverse(); // ここで再度反転させる
    }
    for (let i = 0; i < gridSize; i++) {
      newBoard[i][j] = col[i];
    }
  }
  return newBoard;
}

function moveTiles(tiles) {
  let filteredTiles = tiles.filter((val) => val !== 0);
  let mergedTiles = mergeTiles(filteredTiles);
  updateScore();
  while (mergedTiles.length < gridSize) {
    mergedTiles.push(0);
  }
  return mergedTiles;
}

function updateScore() {
  const scoreElement = document.getElementById("score");
  scoreElement.textContent = score;
}

function mergeTiles(tiles) {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] === tiles[i + 1]) {
      score += tiles[i] * 2; // スコアを加算
      tiles[i] *= 2;
      tiles[i + 1] = 0;
    }
  }
  return tiles.filter((val) => val !== 0);
}

function copyBoard(board) {
  return board.map((row) => row.slice());
}

function boardsEqual(board1, board2) {
  return board1.every((row, i) =>
    row.every((cell, j) => cell === board2[i][j])
  );
}

function isGameOver() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (board[i][j] === 0) {
        return false; // まだ空のタイルがある
      }
      if (j < gridSize - 1 && board[i][j] === board[i][j + 1]) {
        return false; // 横に隣接する結合可能なタイルがある
      }
      if (i < gridSize - 1 && board[i][j] === board[i + 1][j]) {
        return false; // 縦に隣接する結合可能なタイルがある
      }
    }
  }
  return true; // ゲームオーバーの条件を全て満たす
}

document.addEventListener("keydown", (e) => {
  if (!gameActive) return; // ゲームが非アクティブなら何もしない

  switch (e.key) {
    case "ArrowUp":
    case "w":
    case "W":
      move("up");
      break;
    case "ArrowDown":
    case "s":
    case "S":
      move("down");
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      move("left");
      break;
    case "ArrowRight":
    case "d":
    case "D":
      move("right");
      break;
    // Control + [F, B, P, N] の処理
    case "f":
    case "F":
      if (e.ctrlKey) move("right");
      break;
    case "b":
    case "B":
      if (e.ctrlKey) move("down");
      break;
    case "p":
    case "P":
      if (e.ctrlKey) move("up");
      break;
    case "n":
    case "N":
      if (e.ctrlKey) move("down");
      break;
    default:
      break;
  }
});

newGame();
window.newGame = newGame;
window.move = move;
window.gridSize = gridSize;
window.board = board;
