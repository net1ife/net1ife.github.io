let boardElement = document.getElementById('sudoku-board');
let newGameButton = document.getElementById('new-game');

let board = new Array(81).fill(0);

function drawBoard() {
    boardElement.innerHTML = '';
    for(let i = 0; i < 81; i++) {
        let cell = document.createElement('input');
        cell.type = 'text';
        cell.maxLength = '1';
        cell.value = board[i] !== 0 ? board[i] : '';
        boardElement.appendChild(cell);
    }
}

function generatePuzzle() {
    // This is a very simple "puzzle generation" for demo purposes
    // For a real game, you'd want a more sophisticated algorithm
    // that can generate proper puzzles with unique solutions
    for(let i = 0; i < 81; i++) {
        board[i] = Math.random() < 0.2 ? Math.ceil(Math.random() * 9) : 0;
    }
    drawBoard();
}

newGameButton.addEventListener('click', generatePuzzle);

// Generate a new puzzle when the page loads
generatePuzzle();
