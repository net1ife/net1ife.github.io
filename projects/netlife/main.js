import * as tf from '@tensorflow/tfjs';

const WIDTH = 400;
const HEIGHT = 400;
const CELL_SIZE = 10;
const GRID_WIDTH = WIDTH / CELL_SIZE;
const GRID_HEIGHT = HEIGHT / CELL_SIZE;
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = WIDTH;
canvas.height = HEIGHT;

// Reset button event listener
document.getElementById('reset-btn').addEventListener('click', () => {
  grid = initializeGrid(GRID_WIDTH, GRID_HEIGHT);
});

let grid = initializeGrid(GRID_WIDTH, GRID_HEIGHT);

function Cell() {
  this.state = Math.round(Math.random());
  this.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

function initializeGrid(gridWidth, gridHeight) {
  let grid = [];
  for (let i = 0; i < gridHeight; i++) {
    let row = [];
    for (let j = 0; j < gridWidth; j++) {
      row.push(new Cell());
    }
    grid.push(row);
  }
  return grid;
}

function draw() {
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const cell = grid[row][col];
      ctx.fillStyle = cell.state > 0.5 ? cell.color : '#242424';
      ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

function update() {
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const cell = grid[row][col];
      cell.state = Math.round(Math.random());
    }
  }
}

function gameLoop() {
  draw();
  update();
  setTimeout(gameLoop, 100);
}

gameLoop();
