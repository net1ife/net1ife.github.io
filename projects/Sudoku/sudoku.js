let boardElement = document.getElementById('sudoku-board');
let newGameButton = document.getElementById('new-game');

let board = [...Array(9)].map(e => Array(9).fill(0));

function drawBoard() {
    boardElement.innerHTML = '';
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            let cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = '1';
            cell.value = board[i][j] !== 0 ? board[i][j] : '';
            cell.addEventListener('input', (e) => checkValidity(e, i, j));
            boardElement.appendChild(cell);
        }
    }
}

function checkValidity(e, i, j) {
    let value = e.target.value;
    if (value === '') return;
    let num = parseInt(value);
    if (!Number.isInteger(num) || num < 1 || num > 9 || !isValidMove(i, j, num)) {
        e.target.classList.add('error');
    } else {
        e.target.classList.remove('error');
    }
}

function isValidMove(row, col, num) {
    for(let i = 0; i < 9; i++) {
        if(board[row][i] == num || board[i][col] == num) return false;
    }
    let boxRowStart = row - row % 3, boxColStart = col - col % 3;
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            if(board[i + boxRowStart][j + boxColStart] == num) return false;
        }
    }
    return true;
}

function generatePuzzle() {
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            board[i][j] = Math.random() < 0.2 ? Math.ceil(Math.random() * 9) : 0;
        }
    }
    drawBoard();
}

newGameButton.addEventListener('click', generatePuzzle);

generatePuzzle();
