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

function checkValidity(e, row, col) {
    let value = e.target.value;
    if (value === '') return;
    let num = parseInt(value);
    if (!Number.isInteger(num) || num < 1 || num > 9 || !isValid(num, row, col)) {
        e.target.classList.add('error');
    } else {
        e.target.classList.remove('error');
    }
}

function isValid(num, row, col) {
    for(let i = 0; i < 9; i++) {
        if(board[i][col] === num || board[row][i] === num) {
            return false;
        }
    }
    let startRow = row - row % 3;
    let startCol = col - col % 3;
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            if(board[i + startRow][j + startCol] === num) {
                return false;
            }
        }
    }
    return true;
}

function generatePuzzle() {
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            let num = Math.ceil(Math.random() * 9);
            board[i][j] = Math.random() < 0.2 ? num : 0;
        }
    }
    drawBoard();
}

newGameButton.addEventListener('click', generatePuzzle);

generatePuzzle();
