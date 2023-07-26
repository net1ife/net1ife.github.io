import * as tf from '@tensorflow/tfjs';

const WIDTH = 400;
const HEIGHT = 400;
const CELL_SIZE = 10;
const GRID_WIDTH = WIDTH / CELL_SIZE;
const GRID_HEIGHT = HEIGHT / CELL_SIZE;
const BREED_THRESHOLD = 0.75;
const AGE_LIMIT = 100;
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
  this.model = tf.sequential();
  this.model.add(tf.layers.dense({ units: 18, inputShape: [9], activation: 'relu' }));
  this.model.add(tf.layers.dense({ units: 9, activation: 'relu' }));
  this.model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
  this.model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });

  this.state = Math.round(Math.random());
  this.age = 0;
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
      ctx.fillStyle = cell.state > 0.5 ? cell.color : 'white';
      ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

function gameLoop() {
  draw();
  update();
  setTimeout(gameLoop, 100);
}

gameLoop();
