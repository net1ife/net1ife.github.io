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
        cell.addEventListener('input', checkValidity);
        boardElement.appendChild(cell);
    }
}

function checkValidity(e) {
    let value = e.target.value;
    if (value === '') return;
    if (!Number.isInteger(parseInt(value)) || value < 1 || value > 9) {
        e.target.classList.add('error');
    } else {
        e.target.classList.remove('error');
    }
}

function generatePuzzle() {
    for(let i = 0; i < 81; i++) {
        board[i] = Math.random() < 0.2 ? Math.ceil(Math.random() * 9) : 0;
    }
    drawBoard();
}

newGameButton.addEventListener('click', generatePuzzle);

generatePuzzle();
