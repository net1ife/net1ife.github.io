const CELL_SIZE = 10;  
const GRID_WIDTH = 400 / CELL_SIZE;  
const GRID_HEIGHT = 400 / CELL_SIZE;  
const DELAY = 100;  
let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

let grid = Array(GRID_HEIGHT).fill().map(() => Array(GRID_WIDTH).fill().map(() => getRandomInt(2)));

function updateGrid() {
    let newGrid = Array(GRID_HEIGHT).fill().map(() => Array(GRID_WIDTH).fill(0));
    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            let liveNeighbors = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (!(i === 0 && j === 0) && 
                        row + i >= 0 && row + i < GRID_HEIGHT && 
                        col + j >= 0 && col + j < GRID_WIDTH) {
                        liveNeighbors += grid[row + i][col + j];
                    }
                }
            }

            if (grid[row][col] === 1) {
                if (liveNeighbors < 2 || liveNeighbors > 3) {
                    newGrid[row][col] = 0;
                } else {
                    newGrid[row][col] = 1;
                }
            } else {
                if (liveNeighbors === 3) {
                    newGrid[row][col] = 1;
                }
            }
        }
    }
    grid = newGrid;
}

function drawGrid() {
    context.clearRect(0, 0, 400, 400);
    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            let x = col * CELL_SIZE;
            let y = row * CELL_SIZE;
            if (grid[row][col] === 1) {
                context.fillStyle = 'black';
                context.fillRect(x, y, CELL_SIZE, CELL_SIZE);
            }
        }
    }
}

function gameLoop() {
    setTimeout(() => {
        requestAnimationFrame(gameLoop);
        drawGrid();
        updateGrid();
    }, DELAY);
}

gameLoop();
