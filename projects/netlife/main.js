// Import TensorFlow.js
import * as tf from '@tensorflow/tfjs';

// Set up constants
const WIDTH = 400;
const HEIGHT = 400;
const CELL_SIZE = 10;
const GRID_WIDTH = WIDTH / CELL_SIZE;
const GRID_HEIGHT = HEIGHT / CELL_SIZE;
const BREED_THRESHOLD = 0.75;
const AGE_LIMIT = 100;

// Set up the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Get control elements
const resetButton = document.getElementById('resetButton');
const delayRange = document.getElementById('delayRange');

// Set up the cells
let cells = [];
for (let i = 0; i < GRID_HEIGHT; i++) {
    cells[i] = [];
    for (let j = 0; j < GRID_WIDTH; j++) {
        cells[i][j] = createCell();
    }
}

// Function to create a new cell
function createCell() {
    // Define the model architecture
    const model = tf.sequential();
    model.add(tf.layers.dense({inputShape: [9], units: 18, activation: 'relu'}));
    model.add(tf.layers.dense({units: 9, activation: 'relu'}));
    model.add(tf.layers.dense({units: 1, activation: 'sigmoid'}));

    // Compile the model
    model.compile({loss: 'meanSquaredError', optimizer: 'adam'});

    // Return the new cell
    return {
        model: model,
        state: Math.random(),
        age: 0
    };
}

// Function to get the neighborhood of a cell
function getNeighborhood(x, y) {
    const neighborhood = [];
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const nx = (x + i + GRID_HEIGHT) % GRID_HEIGHT;
            const ny = (y + j + GRID_WIDTH) % GRID_WIDTH;
            neighborhood.push(cells[nx][ny].state);
        }
    }
    return tf.tensor(neighborhood, [1, 9]);
}

// Function to update the state of the game
function updateState() {
    // Create new cells
    const newCells = [];

    // Go through the cells
    for (let i = 0; i < GRID_HEIGHT; i++) {
        for (let j = 0; j < GRID_WIDTH; j++) {
            // Get the neighborhood of the cell
            const neighborhood = getNeighborhood(i, j);

            // Predict the next state of the cell
            const nextState = cells[i][j].model.predict(neighborhood).dataSync()[0];
            cells[i][j].state = nextState;

            // Increase the age of the cell
            cells[i][j].age++;

            // Reset the cell if it's too old
            if (cells[i][j].age > AGE_LIMIT) {
                cells[i][j] = createCell();
            }

            // Breed the cell if it's state is high enough
            if (nextState > BREED_THRESHOLD) {
                const neighbors = neighborhood.dataSync();
                for (const neighbor of neighbors) {
                    if (neighbor > BREED_THRESHOLD) {
                        const child = createCell();
                        child.model.setWeights(tf.add(cells[i][j].model.getWeights(), child.model.getWeights()));
                        newCells.push(child);
                    }
                }
            }
        }
    }

    // Add the new cells to the game
    for (const cell of newCells) {
        const x = Math.floor(Math.random() * GRID_HEIGHT);
        const y = Math.floor(Math.random() * GRID_WIDTH);
        cells[x][y] = cell;
    }
}

// Function to draw the game
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw the cells
    for (let i = 0; i < GRID_HEIGHT; i++) {
        for (let j = 0; j < GRID_WIDTH; j++) {
            if (cells[i][j].state > 0.5) {
                ctx.fillStyle = '#50fa7b';
            } else {
                ctx.fillStyle = '#282a36';
            }
            ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }
}

// Function to run the game loop
function gameLoop() {
    // Update the state
    updateState();

    // Draw the game
    draw();

    // Schedule the next game loop
    setTimeout(gameLoop, delayRange.value);
}

// Event listener for the reset button
resetButton.addEventListener('click', () => {
    // Reset the cells
    for (let i = 0; i < GRID_HEIGHT; i++) {
        for (let j = 0; j < GRID_WIDTH; j++) {
            cells[i][j] = createCell();
        }
    }

    // Redraw the game
    draw();
});

// Start the game loop
gameLoop();
