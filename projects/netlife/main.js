import * as tf from '@tensorflow/tfjs';

const WIDTH = 400, HEIGHT = 400, CELL_SIZE = 10;
const GRID_WIDTH = WIDTH / CELL_SIZE, GRID_HEIGHT = HEIGHT / CELL_SIZE;
const BREED_THRESHOLD = 0.75, AGE_LIMIT = 100;

let cells = [];

class Cell {
    constructor() {
        this.neuralNet = tf.sequential();
        this.neuralNet.add(tf.layers.dense({units: 18, inputShape: [9], activation: 'relu'}));
        this.neuralNet.add(tf.layers.dense({units: 9, activation: 'relu'}));
        this.neuralNet.add(tf.layers.dense({units: 1, activation: 'sigmoid'}));
        this.neuralNet.compile({loss: 'meanSquaredError', optimizer: 'adam'});
        this.state = Math.random();
        this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        this.age = 0;
    }

    async predictNextState(neighborhoodStates) {
        const targetState = tf.tensor1d([neighborhoodStates.reduce((a, b) => a + b, 0) / neighborhoodStates.length]);
        const predictedState = this.neuralNet.predict(tf.tensor2d([neighborhoodStates])).dataSync()[0];
        const loss = (predictedState - targetState.arraySync()[0]) ** 2;
        await this.neuralNet.fit(tf.tensor2d([neighborhoodStates]), targetState, {epochs: 1});
        this.state = predictedState;
        this.age++;
        if (this.age > AGE_LIMIT) this.reset();
    }

    breed(other) {
        const child = new Cell();
        const weights = this.neuralNet.getWeights();
        const otherWeights = other.neuralNet.getWeights();
        const newWeights = weights.map((w, i) => tf.add(w, otherWeights[i]).div(2.0));
        child.neuralNet.setWeights(newWeights);
        return child;
    }

    reset() {
        this.state = 0;
        this.age = 0;
    }
}

function getNeighborhood(i, j) {
    let neighborhood = [];
    for (let x = i - 1; x <= i + 1; x++) {
        for (let y = j - 1; y <= j + 1; y++) {
            neighborhood.push(cells[x < 0 ? GRID_HEIGHT - 1 : x >= GRID_HEIGHT ? 0 : x][y < 0 ? GRID_WIDTH - 1 : y >= GRID_WIDTH ? 0 : y].state);
        }
    }
    return neighborhood;
}

async function update() {
    for (let i = 0; i < GRID_HEIGHT; i++) {
        for (let j = 0; j < GRID_WIDTH; j++) {
            const neighborhood = getNeighborhood(i, j);
            await cells[i][j].predictNextState(neighborhood);
            if (cells[i][j].state > BREED_THRESHOLD) {
                for (let n = 0; n < neighborhood.length; n++) {
                    if (neighborhood[n] > BREED_THRESHOLD) {
                        cells[Math.floor(Math.random() * GRID_HEIGHT)][Math.floor(Math.random() * GRID_WIDTH)] = cells[i][j].breed(cells[(i + Math.floor(n / 3) - 1) % GRID_HEIGHT][(j + n % 3 - 1) % GRID_WIDTH]);
                    }
                }
            }
        }
    }
}

// Function to draw the game
function draw() {
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');

    // Clear the canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw the cells
    for (let i = 0; i < GRID_HEIGHT; i++) {
        for (let j = 0; j < GRID_WIDTH; j++) {
            // Change color based on the cell's state
            if (cells[i][j].state > 0.5) {
                ctx.fillStyle = '#50fa7b';
            } else {
                ctx.fillStyle = '#282a36';
            }
            ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }
}

// Create the initial grid
for (let i = 0; i < GRID_HEIGHT; i++) {
    let row = [];
    for (let j = 0; j < GRID_WIDTH; j++) {
        row.push(new Cell());
    }
    cells.push(row);
}

// Set up the game loop
async function gameLoop() {
    draw();
    await update();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
