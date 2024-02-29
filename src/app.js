document.addEventListener("DOMContentLoaded", () => {
  const scoreDisplay = document.querySelector("#score");
  const grid = document.querySelector(".grid");
  const width = 28;
  const squares = [];
  let score = 0;

  // Create characters
  class Ghost {
    constructor(className, startIndex, speed) {
      this.className = className;
      this.startIndex = startIndex;
      this.speed = speed;
      this.currentIndex = startIndex;
      this.isScared = false;
      this.timerId = NaN;
    }
  }

  // Implementing ghosts as an array
  const ghosts = [
    new Ghost("blinky", 348, 250),
    new Ghost("pinky", 376, 400),
    new Ghost("inky", 351, 300),
    new Ghost("chinky", 379, 500),
  ];

  // Grid layout
  // 0 = pac-dots
  // 1 = wall
  // 2 = ghost-liar
  // 3 = power-pallet
  // 4 = empty-space
  const layout = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1,
    1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 3, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0,
    1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 3, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0,
    1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1,
    1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1,
    1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 2, 2, 2, 2, 1,
    1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2,
    2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 2,
    2, 2, 2, 2, 2, 2, 2, 4, 0, 0, 0, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 0, 1,
    1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 2, 2, 2, 2, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1,
    1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0,
    0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1,
    0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1,
    1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 3, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0,
    0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1,
  ];

  function createBoard() {
    for (let i = 0; i < layout.length; i++) {
      const gridSquare = document.createElement("div");
      grid.appendChild(gridSquare);
      squares.push(gridSquare);

      // Adding layout to the board
      if (layout[i] === 0) {
        squares[i].classList.add("pac-dot");
      } else if (layout[i] === 1) {
        squares[i].classList.add("wall");
      } else if (layout[i] === 2) {
        squares[i].classList.add("ghost-liar");
      } else if (layout[i] === 3) {
        squares[i].classList.add("power-pallet");
      }
    }
  }

  // Create board and add characters to it
  createBoard();
  ghosts.forEach((ghost) => {
    squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
  });

  // Move ghost function
  function moveGhost(ghost) {
    const directions = [-1, 1, -width, width];
    ghost.timerId = setInterval(() => {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      if (
        !squares[ghost.currentIndex + dir].classList.contains("ghost") &&
        !squares[ghost.currentIndex + dir].classList.contains("wall")
      ) {
        squares[ghost.currentIndex].classList.remove(
          ghost.className,
          "ghost",
          "scared-ghost"
        );
        ghost.currentIndex += dir;
        squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
      }
      // if ghost is scared
      if (ghost.isScared) {
        squares[ghost.currentIndex].classList.add("scared-ghost");
      }
      // if ghost is currently scared and pac-man is on it
      if (
        ghost.isScared &&
        squares[ghost.currentIndex].classList.contains("pac-man")
      ) {
        ghost.isScared = false;
        squares[ghost.currentIndex].classList.remove(
          ghost.className,
          "ghost",
          "scared-ghost"
        );
        ghost.currentIndex = ghost.startIndex;
        score += 100;
        scoreDisplay.innerText = score;
        squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
        gameOver();
      }
    }, ghost.speed);
  }

  // Move ghosts randomly
  ghosts.forEach((ghost) => moveGhost(ghost));

  // Move pac-man function
  function movePacman(e) {
    squares[pacManCurrentIndex].classList.remove("pac-man");
    switch (e.key) {
      case "ArrowLeft":
        if (
          pacManCurrentIndex % width != 0 &&
          !squares[pacManCurrentIndex - 1].classList.contains("wall") &&
          !squares[pacManCurrentIndex - 1].classList.contains("ghost-liar")
        ) {
          pacManCurrentIndex -= 1;
        }
        if (pacManCurrentIndex - 1 === 363) {
          pacManCurrentIndex = 391;
        }
        break;
      case "ArrowRight":
        if (
          pacManCurrentIndex % width < width - 1 &&
          !squares[pacManCurrentIndex + 1].classList.contains("wall") &&
          !squares[pacManCurrentIndex + 1].classList.contains("ghost-liar")
        ) {
          pacManCurrentIndex += 1;
        }
        if (pacManCurrentIndex + 1 === 392) {
          pacManCurrentIndex = 364;
        }
        break;
      case "ArrowUp":
        if (
          pacManCurrentIndex - width >= 0 &&
          !squares[pacManCurrentIndex - width].classList.contains("wall") &&
          !squares[pacManCurrentIndex - width].classList.contains("ghost-liar")
        ) {
          pacManCurrentIndex -= width;
        }
        break;
      case "ArrowDown":
        if (
          pacManCurrentIndex + width < width * width &&
          !squares[pacManCurrentIndex + width].classList.contains("wall") &&
          !squares[pacManCurrentIndex + width].classList.contains("ghost-liar")
        ) {
          pacManCurrentIndex += width;
        }
        break;
    }
    squares[pacManCurrentIndex].classList.add("pac-man");
    pacDotEaten();
    powerPalletEaten();
    gameOver();
    gameWin();
  }

  // Initialize pac-man
  let pacManCurrentIndex = 490;
  squares[pacManCurrentIndex].classList.add("pac-man");

  // Event listener for moving pac-man
  document.addEventListener("keydown", movePacman);

  // When you eat a pac-dot
  function pacDotEaten() {
    if (squares[pacManCurrentIndex].classList.contains("pac-dot")) {
      score++;
      scoreDisplay.innerText = score;
      squares[pacManCurrentIndex].classList.remove("pac-dot");
    }
  }

  // When you eat a power-pallet
  function powerPalletEaten() {
    if (squares[pacManCurrentIndex].classList.contains("power-pallet")) {
      score += 10;
      scoreDisplay.innerText = score;
      ghosts.forEach((ghost) => (ghost.isScared = true));
      setTimeout(unscareGhosts, 10000);
      squares[pacManCurrentIndex].classList.remove("power-pallet");
    }
  }

  // Make ghosts stop blinking
  function unscareGhosts() {
    ghosts.forEach((ghost) => (ghost.isScared = false));
  }

  // Check for game over
  function gameOver() {
    if (
      squares[pacManCurrentIndex].classList.contains("ghost") &&
      !squares[pacManCurrentIndex].classList.contains("scared-ghost")
    ) {
      ghosts.forEach((ghost) => clearInterval(ghost.timerId));
      document.removeEventListener("keydown", movePacman);
      setTimeout(() => {
        alert("Game over!!   press ok to continue");
        window.location.reload();
      }, 500);
    }
  }

  // Check for win condition
  function gameWin() {
    if (score >= 300) {
      ghosts.forEach((ghost) => clearInterval(ghost.timerId));
      document.removeEventListener("keydown", movePacman);
      setTimeout(() => {
        alert("You Win!!   press ok to continue");
        window.location.reload();
      }, 500);
    }
  }
});
