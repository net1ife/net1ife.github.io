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
    if (!Number.isInteger(num) || num < 1 || num > 9 || num !== board[i][j]) {
        e.target.classList.add('error');
    } else {
        e.target.classList.remove('error');
    }
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
