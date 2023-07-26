// import dependencies
import * as tf from '@tensorflow/tfjs';

// constants
const GRID_WIDTH = 40;
const GRID_HEIGHT = 40;
const CELL_SIZE = 10;
const BREED_THRESHOLD = 0.75;
const AGE_LIMIT = 100;

// Create neural network model
function createModel() {
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 18, inputShape: [9], activation: 'relu'}));
    model.add(tf.layers.dense({units: 9, activation: 'relu'}));
    model.add(tf.layers.dense({units: 1, activation: 'sigmoid'}));
    return model;
}

// initialize grid with cells
let grid = [];
for (let i = 0; i < GRID_HEIGHT; i++) {
    let row = [];
    for (let j = 0; j < GRID_WIDTH; j++) {
        let cell = {
            model: createModel(),
            state: Math.random() > 0.5 ? 1 : 0,
            age: 0,
        };
        row.push(cell);
    }
    grid.push(row);
}

// main update function
function update() {
    for (let i = 0; i < GRID_HEIGHT; i++) {
        for (let j = 0; j < GRID_WIDTH; j++) {
            let neighborhoodStates = getNeighborhoodStates(i, j);
            let targetState = tf.mean(neighborhoodStates);
            let predictedState = grid[i][j].model.predict(tf.tensor(neighborhoodStates, [1, 9]));

            // calculate loss
            let loss = tf.losses.meanSquaredError(targetState, predictedState);

            // optimize the model
            grid[i][j].model.compile({optimizer: 'adam', loss: 'meanSquaredError'});
            grid[i][j].model.fit(tf.tensor(neighborhoodStates, [1, 9]), tf.tensor([targetState]), {epochs: 1});

            grid[i][j].state = predictedState.dataSync()[0];
            grid[i][j].age++;

            if (grid[i][j].age > AGE_LIMIT) {
                resetCell(i, j);
            }

            if (grid[i][j].state > BREED_THRESHOLD) {
                breedCell(i, j);
            }
        }
    }
}

// get neighborhood states
function getNeighborhoodStates(i, j) {
    let states = [];
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            let ni = (i + x + GRID_HEIGHT) % GRID_HEIGHT;
            let nj = (j + y + GRID_WIDTH) % GRID_WIDTH;
            states.push(grid[ni][nj].state);
        }
    }
    return states;
}

// reset cell
function resetCell(i, j) {
    grid[i][j].state = 0;
    grid[i][j].age = 0;
}

// breed cell
function breedCell(i, j) {
    // find neighbor to breed with
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            let ni = (i + x + GRID_HEIGHT) % GRID_HEIGHT;
            let nj = (j + y + GRID_WIDTH) % GRID_WIDTH;
            if (grid[ni][nj].state > BREED_THRESHOLD) {
                let childModel = createModel();
                let weights1 = grid[i][j].model.getWeights();
                let weights2 = grid[ni][nj].model.getWeights();
                let averageWeights = [];
                for (let k = 0; k < weights1.length; k++) {
                    averageWeights.push(weights1[k].add(weights2[k]).div(tf.scalar(2)));
                }
                childModel.setWeights(averageWeights);
                let childCell = {
                    model: childModel,
                    state: 0,
                    age: 0,
                };
                grid[Math.floor(Math.random() * GRID_HEIGHT)][Math.floor(Math.random() * GRID_WIDTH)] = childCell;
            }
        }
    }
}

// main game loop
function gameLoop() {
    update();
    setTimeout(gameLoop, 100);
}

// start the game loop
gameLoop();
