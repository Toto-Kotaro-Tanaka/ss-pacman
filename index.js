import { LEVEL, OBJECT_TYPE } from "./setup.js";
import { randomMovement } from "./ghostMoves.js";
// Classes
import GameBoard from "./GameBoard.js";
import Pacman from "./Pacman.js";
import Ghost from "./Ghost.js";

// DOM Elements
const gameGrid = document.querySelector("#game");
const scoreTable = document.querySelector("#score");
const startButton = document.querySelector("#start-button");

// Game Constants
const POWER_PILL_TIME = 10000;
const GLOBAL_SPEED = 80;
const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL);

// Initial Setup
let score = 0;
let timer = null;
let gameWin = false;
let powerPillActive = false;
let powerPillTimer = null;

// Audio
function playAudio(audio) {
    const soundEffect = new Audio(audio);
    soundEffect.play();
}

const gameOver = (pacman, grid) => {
    playAudio("./sounds/death.wav");
    document.removeEventListener("keydown", (e) => {
        pacman.handleKeyInput(e, gameBoard.objectExist);
    });

    gameBoard.showGameStatus(gameWin);
    clearInterval(timer);
    startButton.classList.remove("hide");
};

const gameFinish = (pacman, grid) => {
    document.removeEventListener("keydown", (e) => {
        pacman.handleKeyInput(e, gameBoard.objectExist);
    });
};

const checkCollision = (pacman, ghosts) => {
    const collidedGhost = ghosts.find((ghost) => pacman.pos === ghost.pos);

    if (collidedGhost) {
        if (pacman.powerPill) {
            playAudio("./sounds/eat_ghost.wav");
            gameBoard.removeObject(collidedGhost.pos, [
                OBJECT_TYPE.GHOST,
                OBJECT_TYPE.SCARED,
                collidedGhost.name,
            ]);
            collidedGhost.pos = collidedGhost.startPos;
            score += 100;
        } else {
            gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
            gameBoard.rotateDiv(pacman.pos, 0);
            gameOver(pacman, gameGrid);
        }
    }
};

const gameLoop = (pacman, ghosts) => {
    gameBoard.moveCharacter(pacman);
    checkCollision(pacman, ghosts);

    ghosts.forEach((ghost) => gameBoard.moveCharacter(ghost));
    checkCollision(pacman, ghosts);

    // Check if Pacman eats a dot
    if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.DOT)) {
        playAudio("./sounds/munch.wav");
        gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.DOT]);
        gameBoard.dotCount--;
        score += 10;
    }

    // Check if Pacman eats powerpill
    if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.PILL)) {
        playAudio("./sounds/pill.wav");
        gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PILL]);

        pacman.powerPill = true;
        score += 50;

        clearTimeout(powerPillTimer);
        powerPillTimer = setTimeout(
            () => (pacman.powerPill = false),
            POWER_PILL_TIME,
        );
    }

    // Change ghosts scare mode depending on powerpill
    if (pacman.powerPill !== powerPillActive) {
        powerPillActive = pacman.powerPill;
        ghosts.forEach((ghost) => (ghost.isScared = pacman.powerPill));
    }

    // Check if all dots have been eaten
    if (gameBoard.dotCount === 0) {
        gameWin = true;
        gameFinish(pacman, gameGrid);
    }

    // Show the score
    scoreTable.innerHTML = score;
};

const startGame = () => {
    gameWin = false;
    powerPillActive = false;
    score = 0;

    playAudio("./sounds/game_start.wav");
    startButton.classList.add("hide");

    gameBoard.createGrid(LEVEL);

    const pacman = new Pacman(2, 287);
    gameBoard.addObject(287, [OBJECT_TYPE.PACMAN]);
    document.addEventListener("keydown", (e) => {
        pacman.handleKeyInput(e, gameBoard.objectExist);
    });

    const ghosts = [
        new Ghost(5, 188, randomMovement, OBJECT_TYPE.BLINKY),
        new Ghost(4, 209, randomMovement, OBJECT_TYPE.PINKY),
        new Ghost(3, 230, randomMovement, OBJECT_TYPE.INKY),
        new Ghost(2, 251, randomMovement, OBJECT_TYPE.CLYDE),
    ];

    timer = setInterval(() => gameLoop(pacman, ghosts), GLOBAL_SPEED);
};

// Initialise game
startButton.addEventListener("click", startGame);