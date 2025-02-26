const rows = 6;
const cols = 7;
let player1Wins = 0;
let player2Wins = 0;

const gameBoard = document.getElementById('game-board');
const modal = document.getElementById('victory-modal');
const closeButton = document.querySelectorAll('.close-button');
const victoryMessage = document.getElementById('victory-message');
const restartGameButton = document.getElementById('restart-game-button');
const trophyImage = document.getElementById('trophy-image');

const table = document.createElement('table');
table.setAttribute('border', '1');
table.setAttribute('cellspacing', '0');
table.setAttribute('cellpadding', '0');

const tbody = document.createElement('tbody');

for (let i = 0; i < rows; i++) {
    const tr = document.createElement('tr');
    for (let j = 0; j < cols; j++) {
        const td = document.createElement('td');
        td.classList.add('empty');
        tr.appendChild(td);
    }
    tbody.appendChild(tr);
}

table.appendChild(tbody);
gameBoard.appendChild(table);

let currentPlayer = 'player1';
let isGameOver = false;

const cells = document.querySelectorAll('td');
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (isGameOver) {
            return;
        }

        const colIndex = index % cols;
        for (let rowIndex = rows - 1; rowIndex >= 0; rowIndex--) {
            const targetCell = cells[rowIndex * cols + colIndex];
            if (targetCell.classList.contains('empty')) {
                targetCell.classList.remove('empty');
                targetCell.classList.add(currentPlayer, 'fall');

                makeMove(targetCell);

                if (checkWin()) {
                    setTimeout(() => {
                        victoryMessage.textContent = `Victory for ${currentPlayer === 'player1' ? 'Player 1 (Green)' : 'Player 2 (Red)'}!`;
                        modal.style.display = 'block';
                        trophyImage.style.display = 'block';

                        triggerConfetti();

                        if (currentPlayer === 'player1') {
                            player1Wins++;
                        } else {
                            player2Wins++;
                        }
                        updateWinCounter();
                        saveToLocalStorage();

                        isGameOver = true;
                    }, 100);
                    return;
                }
                if (isBoardFull()) {
                    setTimeout(() => {
                        victoryMessage.textContent = 'Unentschieden! 😐';
                        modal.style.display = 'block';
                        trophyImage.style.display = 'none'; // Trophäenbild bei Unentschieden ausblenden
                        isGameOver = true;
                    }, 100);
                    return;
                }
                currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
                updateCurrentPlayerDisplay();
                return;
            }
        }
    });
});

function checkWin() {
    return checkHorizontalWin() || checkVerticalWin() || checkDiagonalWin() || checkDiagonalWin2();
}

function checkHorizontalWin() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols - 3; col++) {
            const cell1 = cells[row * cols + col];
            const cell2 = cells[row * cols + col + 1];
            const cell3 = cells[row * cols + col + 2];
            const cell4 = cells[row * cols + col + 3];
            if (
                !cell1.classList.contains('empty') &&
                cell1.classList.contains(currentPlayer) &&
                cell2.classList.contains(currentPlayer) &&
                cell3.classList.contains(currentPlayer) &&
                cell4.classList.contains(currentPlayer)
            ) {
                return true;
            }
        }
    }
    return false;
}

function checkVerticalWin() {
    for (let row = 0; row < rows - 3; row++) {
        for (let col = 0; col < cols; col++) {
            const cell1 = cells[row * cols + col];
            const cell2 = cells[(row + 1) * cols + col];
            const cell3 = cells[(row + 2) * cols + col];
            const cell4 = cells[(row + 3) * cols + col];
            if (
                !cell1.classList.contains('empty') &&
                cell1.classList.contains(currentPlayer) &&
                cell2.classList.contains(currentPlayer) &&
                cell3.classList.contains(currentPlayer) &&
                cell4.classList.contains(currentPlayer)
            ) {
                return true;
            }
        }
    }
    return false;
}

function checkDiagonalWin() {
    for (let row = 0; row < rows - 3; row++) {
        for (let col = 0; col < cols - 3; col++) {
            const cell1 = cells[row * cols + col];
            const cell2 = cells[(row + 1) * cols + col + 1];
            const cell3 = cells[(row + 2) * cols + col + 2];
            const cell4 = cells[(row + 3) * cols + col + 3];
            if (
                !cell1.classList.contains('empty') &&
                cell1.classList.contains(currentPlayer) &&
                cell2.classList.contains(currentPlayer) &&
                cell3.classList.contains(currentPlayer) &&
                cell4.classList.contains(currentPlayer)
            ) {
                return true;
            }
        }
    }
    return false;
}

function checkDiagonalWin2() {
    for (let row = 0; row < rows - 3; row++) {
        for (let col = 3; col < cols; col++) {
            const cell1 = cells[row * cols + col];
            const cell2 = cells[(row + 1) * cols + col - 1];
            const cell3 = cells[(row + 2) * cols + col - 2];
            const cell4 = cells[(row + 3) * cols + col - 3];
            if (
                !cell1.classList.contains('empty') &&
                cell1.classList.contains(currentPlayer) &&
                cell2.classList.contains(currentPlayer) &&
                cell3.classList.contains(currentPlayer) &&
                cell4.classList.contains(currentPlayer)
            ) {
                return true;
            }
        }
    }
    return false;
}

document.getElementById('restart-button').addEventListener('click', () => {
    resetGame();
    saveToLocalStorage();
});

window.addEventListener('load', () => {
    loadFromLocalStorage();
    resetGame();
});

function resetGame() {
    cells.forEach(cell => {
        cell.classList.remove('player1', 'player2', 'fall');
        cell.classList.add('empty');
    });

    player1Moves = 0;
    player2Moves = 0;

    currentPlayer = Math.random() < 0.5 ? 'player1' : 'player2';

    updateMoveCounter();
    updateCurrentPlayerDisplay();

    isGameOver = false;

    console.log('Game Restarted');
}

currentPlayer = Math.random() < 0.5 ? 'player1' : 'player2';

function updateCurrentPlayerDisplay() {
    const currentPlayerName = currentPlayer === 'player1' ? 'Spieler 1 (Green)' : 'Spieler 2 (Red)';
    document.getElementById('current-player-name').textContent = currentPlayerName;
}

function updateMoveCounter() {
    document.getElementById('player1-moves').textContent = `${player1Moves} (Green)`;
    document.getElementById('player2-moves').textContent = `${player2Moves} (Red)`;
}

function updateWinCounter() {
    document.getElementById('player1-wins').textContent = player1Wins + '(Green)';
    document.getElementById('player2-wins').textContent = player2Wins + '(Red)';
}

function makeMove(cell) {
    if (currentPlayer === 'player1') {
        player1Moves++;
    } else {
        player2Moves++;
    }
    updateMoveCounter();
    updateCurrentPlayerDisplay();
    saveToLocalStorage();
}

document.getElementById('reset-win-counter').addEventListener('click', () => {
    resetWinCounter();
    saveToLocalStorage();
});

function resetWinCounter() {
    player1Wins = 0;
    player2Wins = 0;
    updateWinCounter();
    saveToLocalStorage();
}

function isBoardFull() {
    return [...cells].every(cell => !cell.classList.contains('empty'));
}

function saveToLocalStorage() {
    localStorage.setItem('player1Wins', player1Wins);
    localStorage.setItem('player2Wins', player2Wins);
    localStorage.setItem('player1Moves', player1Moves);
    localStorage.setItem('player2Moves', player2Moves);
}

function loadFromLocalStorage() {
    player1Wins = parseInt(localStorage.getItem('player1Wins')) || 0;
    player2Wins = parseInt(localStorage.getItem('player2Wins')) || 0;
    player1Moves = parseInt(localStorage.getItem('player1Moves')) || 0;
    player2Moves = parseInt(localStorage.getItem('player2Moves')) || 0;
    updateWinCounter();
    updateMoveCounter();
}

function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

closeButton.forEach(button => {
    button.addEventListener('click', () => {
        modal.style.display = 'none';
    });
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

restartGameButton.addEventListener('click', () => {
    modal.style.display = 'none';
    resetGame();
});