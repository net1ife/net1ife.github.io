import * as tf from '@tensorflow/tfjs';

let breedThreshold = 0.75;
let updateDelay = 100;
let intervalId;

const WIDTH = 400;
const HEIGHT = 400;
const CELL_SIZE = 10;
const GRID_WIDTH = WIDTH / CELL_SIZE;
const GRID_HEIGHT = HEIGHT / CELL_SIZE;

class Cell {
    constructor() {
        this.model = tf.sequential();
        this.model.add(tf.layers.dense({units: 18, inputShape: [9], activation: 'relu'}));
        this.model.add(tf.layers.dense({units: 9, activation: 'relu'}));
        this.model.add(tf.layers.dense({units: 1, activation: 'sigmoid'}));

        this.model.compile({optimizer: 'adam', loss: 'meanSquaredError'});

        this.state = Math.random() > 0.5 ? 1 : 0;
        this.age = 0;
    }

    async predictNextState(neighborhoodStates) {
        const targetState = neighborhoodStates.reduce((a, b) => a + b, 0) / neighborhoodStates.length;
        const predictedState = this.model.predict(tf.tensor2d([neighborhoodStates], [1, neighborhoodStates.length])).arraySync()[0][0];

        await this.model.fit(tf.tensor2d([neighborhoodStates], [1, neighborhoodStates.length]), tf.tensor2d([targetState], [1, 1]));

        this.state = predictedState;
        this.age++;

        if (this.age > 100) {
            this.state = 0;
            this.age = 0;
        }
    }
}

let grid = [];

function initGrid() {
    for (let i = 0; i < GRID_HEIGHT; i++) {
        const row = [];
        for (let j = 0; j < GRID_WIDTH; j++) {
            row.push(new Cell());
        }
        grid.push(row);
    }
}

function getNeighborhood(i, j) {
    let neighborhood = [];
    for (let x = i - 1; x <= i + 1; x++) {
        for (let y = j - 1; y <= j + 1; y++) {
            let xi = (x + GRID_HEIGHT) % GRID_HEIGHT;
            let yj = (y + GRID_WIDTH) % GRID_WIDTH;
            neighborhood.push(grid[xi][yj].state);
        }
    }
    return neighborhood;
}

async function updateGrid() {
    for (let i = 0; i < GRID_HEIGHT; i++) {
        for (let j = 0; j < GRID_WIDTH; j++) {
            const neighborhoodStates = getNeighborhood(i, j);
            await grid[i][j].predictNextState(neighborhoodStates);
            if (grid[i][j].state > breedThreshold) {
                grid[Math.floor(Math.random() * GRID_HEIGHT)][Math.floor(Math.random() * GRID_WIDTH)] = new Cell();
            }
        }
    }
}

function draw() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    for (let i = 0; i < GRID_HEIGHT; i++) {
        for (let j = 0; j < GRID_WIDTH; j++) {
            if (grid[i][j].state > 0.5) {
                ctx.fillStyle = '#000';
                ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }
}

function init() {
    if (intervalId) {
        clearInterval(intervalId);
    }
    initGrid();
    intervalId = setInterval(async function() {
        await updateGrid();
        draw();
    }, updateDelay);
}

function reset() {
    if (intervalId) {
        clearInterval(intervalId);
    }
    grid = [];
    init();
}

const form = document.getElementById('settings-form');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    breedThreshold = parseFloat(form['breed-threshold'].value);
    updateDelay = parseInt(form['update-delay'].value);
    reset();
});

const resetButton = document.getElementById('reset-btn');
resetButton.addEventListener('click', reset);

init();
