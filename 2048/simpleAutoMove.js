let autoMoveInterval = null;

document.getElementById("simpleAutoMoveButton").addEventListener("click", function () {
  if (this.textContent === "Stop Simple Auto Move") {
    clearInterval(autoMoveInterval);
    autoMoveInterval = null;
    this.textContent = "Simple Auto Move";
  } else {
    autoMoveInterval = setInterval(automatedMove, 250);
    this.textContent = "Stop Simple Auto Move";
  }
});

function automatedMove() {
  if (canMove("right")) {
    window.move("right");
  } else if (canMove("down")) {
    window.move("down");
  } else if (canMove("up")) {
    window.move("up");
  } else if (canMove("left")) {
    window.move("left");
  }
}

function canMove(direction) {
  for (let i = 0; i < window.gridSize; i++) {
    for (let j = 0; j < window.gridSize; j++) {
      const tile = window.board[i][j];
      if (tile === 0) continue;

      switch (direction) {
        case "left":
          if (
            j > 0 &&
            (window.board[i][j - 1] === 0 || window.board[i][j - 1] === tile)
          ) {
            return true;
          }
          break;
        case "right":
          if (
            j < window.gridSize - 1 &&
            (window.board[i][j + 1] === 0 || window.board[i][j + 1] === tile)
          ) {
            return true;
          }
          break;
        case "up":
          if (
            i > 0 &&
            (window.board[i - 1][j] === 0 || window.board[i - 1][j] === tile)
          ) {
            return true;
          }
          break;
        case "down":
          if (
            i < window.gridSize - 1 &&
            (window.board[i + 1][j] === 0 || window.board[i + 1][j] === tile)
          ) {
            return true;
          }
          break;
        default:
          break;
      }
    }
  }
  return false;
}
