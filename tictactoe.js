const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartButton = document.getElementById('restart-button');
const modal = document.getElementById('victory-modal');
const closeButton = document.querySelector('.close-button');
const victoryMessage = document.getElementById('victory-message');
const restartGameButton = document.getElementById('restart-game-button');
const trophyImage = document.getElementById('trophy-image');
const playerXWinsElement = document.getElementById('player-x-wins');
const playerOWinsElement = document.getElementById('player-o-wins');
const resetWinCounterButton = document.getElementById('reset-win-counter');
let currentPlayer = 'X';
let gameState = Array(9).fill(null);
let playerXWins = 0;
let playerOWins = 0;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function loadFromLocalStorage() {
    playerXWins = parseInt(localStorage.getItem('playerXWins')) || 0;
    playerOWins = parseInt(localStorage.getItem('playerOWins')) || 0;
    updateWinCounter();
}

function saveToLocalStorage() {
    localStorage.setItem('playerXWins', playerXWins);
    localStorage.setItem('playerOWins', playerOWins);
}

function updateWinCounter() {
    playerXWinsElement.textContent = playerXWins;
    playerOWinsElement.textContent = playerOWins;
}

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.getAttribute('data-index');
        if (gameState[index] || checkWin()) return;
        
        gameState[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer === 'X' ? 'x-player' : 'o-player');
        
        if (checkWin()) {
            victoryMessage.textContent = `Spieler ${currentPlayer} gewinnt! 🎉`;
            modal.style.display = 'block';
            trophyImage.style.display = 'block';
            triggerConfetti();
            if (currentPlayer === 'X') {
                playerXWins++;
            } else {
                playerOWins++;
            }
            saveToLocalStorage();
            updateWinCounter();
        } else if (gameState.every(cell => cell)) {
            victoryMessage.textContent = 'Unentschieden! 😐';
            modal.style.display = 'block';
            trophyImage.style.display = 'none'; // Hide the trophy image for a draw
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusText.textContent = `Spieler ${currentPlayer} ist am Zug!`;
        }
    });
});

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return gameState[index] === currentPlayer;
        });
    });
}

restartButton.addEventListener('click', () => {
    resetGame();
});

restartGameButton.addEventListener('click', () => {
    modal.style.display = 'none';
    resetGame();
});

resetWinCounterButton.addEventListener('click', () => {
    playerXWins = 0;
    playerOWins = 0;
    saveToLocalStorage();
    updateWinCounter();
});

closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

function resetGame() {
    gameState.fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x-player', 'o-player');
    });
    currentPlayer = Math.random() < 0.5 ? 'X' : 'O'; // Randomly select the starting player
    statusText.textContent = `Spieler ${currentPlayer} ist am Zug!`;
}

function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

window.addEventListener('load', () => {
    loadFromLocalStorage();
    resetGame();
});

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}