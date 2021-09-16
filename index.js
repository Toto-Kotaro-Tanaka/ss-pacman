import { LEVEL, OBJECT_TYPE } from "./setup.js";
// Classes
import GameBoard from "./GameBoard.js";

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

const gameOver = (pacman, grid) => {};

const checkCollision = (pacman, ghosts) => {};

const gameLoop = (pacman, gohsts) => {};

const startGame = () => {};