// Query selectors
const gameBoardElement = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('startBtn');
const pausePlayButton = document.getElementById('pausePlayBtn');
const resetButton = document.getElementById('resetBtn');
const speedInput = document.getElementById('speedInput');
const speedDisplay = document.getElementById('speedDisplay');

// Game constants
const BOARD_SIZE = 20;
const CELL_SIZE = 20;
const FOOD_POINTS = 10;

// Game variables
let gameBoard;
let snakeArr = [];
let direction;
let foodPos;
let score = 0;
let gameInterval;
let isPaused = false;
let INITIAL_SPEED = 200;

// Function to create an empty game board
const createGameBoard = () => {
	gameBoard = [];
	for (let i = 0; i < BOARD_SIZE; i++) {
		gameBoard[i] = [];
		for (let j = 0; j < BOARD_SIZE; j++) {
			gameBoard[i][j] = null;
		}
	}
};

// Function to initialize the snake at the center of the board
const createSnake = () => {
	const startX = Math.floor(BOARD_SIZE / 2);
	const startY = Math.floor(BOARD_SIZE / 4);
	snakeArr.push({ x: startX, y: startY });
	gameBoard[startX][startY] = 'snake';
	direction = 'right';
};

// Function to randomly generate food on the board
const generateFood = () => {
	let foodX;
	let foodY;
	do {
		foodX = Math.floor(Math.random() * BOARD_SIZE);
		foodY = Math.floor(Math.random() * BOARD_SIZE);
	} while (gameBoard[foodX][foodY] !== null);
	foodPos = { x: foodX, y: foodY };
	gameBoard[foodX][foodY] = 'food';
};

// Function to render the game board with snake and food positions
const renderGameBoard = () => {
	gameBoardElement.innerHTML = '';

	for (let i = 0; i < BOARD_SIZE; i++) {
		for (let j = 0; j < BOARD_SIZE; j++) {
			const cell = document.createElement('div');
			cell.className = 'cell';

			if (gameBoard[i][j] === 'snake') {
				cell.classList.add('snake-head');
			} else if (gameBoard[i][j] === 'food') {
				cell.classList.add('food');
			}

			cell.style.top = `${i * CELL_SIZE}px`;
			cell.style.left = `${j * CELL_SIZE}px`;
			gameBoardElement.appendChild(cell);
		}
	}
};

// Function to move the snake and update its position on the board
const moveSnake = () => {
	const head = snakeArr[0];
	let newHead;

	switch (direction) {
		case 'up':
			newHead = { x: head.x - 1, y: head.y };
			break;
		case 'down':
			newHead = { x: head.x + 1, y: head.y };
			break;
		case 'left':
			newHead = { x: head.x, y: head.y - 1 };
			break;
		case 'right':
			newHead = { x: head.x, y: head.y + 1 };
			break;
	}

	if (
		newHead.x < 0 ||
		newHead.x >= BOARD_SIZE ||
		newHead.y < 0 ||
		newHead.y >= BOARD_SIZE ||
		gameBoard[newHead.x][newHead.y] === 'snake'
	) {
		endGame();
		return;
	}

	snakeArr.unshift(newHead);
	gameBoard[newHead.x][newHead.y] = 'snake';

	if (newHead.x === foodPos.x && newHead.y === foodPos.y) {
		score += FOOD_POINTS;
		scoreElement.textContent = `Score: ${score}`;
		generateFood();
	} else {
		const tail = snakeArr.pop();
		gameBoard[tail.x][tail.y] = null;
	}

	renderGameBoard();
};

// Function to change the snake's direction based on user input
const changeDirection = (event) => {
	if (isPaused) return;

	const keyPressed = event.key;
	switch (keyPressed) {
		case 'ArrowUp':
			direction = 'up';
			break;
		case 'ArrowDown':
			direction = 'down';
			break;
		case 'ArrowLeft':
			direction = 'left';
			break;
		case 'ArrowRight':
			direction = 'right';
			break;
	}
};

// Function to update the speed display
const updateSpeedDisplay = (speed) => {
	speedDisplay.textContent = speed;
	INITIAL_SPEED = speed;
};

// Event listener for speed input
speedInput.addEventListener('input', (event) => {
	const speedValue = event.target.value;
	updateSpeedDisplay(speedValue);
	if (isGameStarted && !isPaused) {
		clearInterval(gameInterval);
		gameInterval = setInterval(moveSnake, speedValue);
	}
});

// Function to start the game
let isGameStarted = false;

const startGame = () => {
	if (isGameStarted) return;

	createGameBoard();
	createSnake();
	generateFood();
	renderGameBoard();
	scoreElement.textContent = 'Score: 0';
	document.addEventListener('keydown', changeDirection);
	gameInterval = setInterval(moveSnake, INITIAL_SPEED);
	isGameStarted = true;
};

// Function to pause or resume the game
const pauseGame = () => {
	if (!gameInterval) return;

	if (isPaused) {
		gameInterval = setInterval(moveSnake, INITIAL_SPEED);
		scoreElement.textContent = `Score: ${score}`;
		pausePlayButton.innerText = 'Pause';
	} else {
		clearInterval(gameInterval);
		scoreElement.textContent = 'Game Paused';
		pausePlayButton.innerText = 'Play';
	}

	isPaused = !isPaused;
};

// Function to reset the game
const resetGame = () => {
	clearInterval(gameInterval);
	snakeArr = [];
	direction = null;
	foodPos = null;
	score = 0;
	isPaused = false;
	isGameStarted = false;
	scoreElement.textContent = 'Score: 0';
	createGameBoard();
	renderGameBoard();
};

// Function to end the game
const endGame = () => {
	clearInterval(gameInterval);
	scoreElement.textContent = 'Game Over';
	snakeArr = [];
	direction = null;
	foodPos = null;
	isPaused = false;
};

startButton.addEventListener('click', startGame);
pausePlayButton.addEventListener('click', pauseGame);
resetButton.addEventListener('click', resetGame);
