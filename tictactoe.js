// Referenzen zu DOM-Elementen abrufen
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

// Spielstatus-Variablen initialisieren
let currentPlayer = 'X';
let gameState = Array(9).fill(null);
let playerXWins = 0;
let playerOWins = 0;

// Gewinnkombinationen definieren
// Gewinnkombinationen definieren
const winningCombinations = [
    [0, 1, 2], // Obere Reihe
    [3, 4, 5], // Mittlere Reihe
    [6, 7, 8], // Untere Reihe
    [0, 3, 6], // Linke Spalte
    [1, 4, 7], // Mittlere Spalte
    [2, 5, 8], // Rechte Spalte
    [0, 4, 8], // Diagonale von oben links nach unten rechts
    [2, 4, 6]  // Diagonale von oben rechts nach unten links
];

// Spielstände aus dem lokalen Speicher laden
function loadFromLocalStorage() {
    playerXWins = parseInt(localStorage.getItem('playerXWins')) || 0;   // parseInt() wandelt den Wert in eine Zahl um
    playerOWins = parseInt(localStorage.getItem('playerOWins')) || 0;
    updateWinCounter();                                             // Gewinnzähler aktualisieren
}

// Spielstände im lokalen Speicher speichern
function saveToLocalStorage() {                                 // localStorage speichert nur Strings
    localStorage.setItem('playerXWins', playerXWins);           // Daher müssen die Werte in Strings umgewandelt werden
    localStorage.setItem('playerOWins', playerOWins);           
}

// Gewinnzähler aktualisieren
function updateWinCounter() {       
    playerXWinsElement.textContent = playerXWins;       // Textinhalt des Elements aktualisieren
    playerOWinsElement.textContent = playerOWins;        
}

// Klick-Event für jede Zelle hinzufügen
cells.forEach(cell => {                                  // forEach() führt eine Funktion für jedes Element im Array aus
    cell.addEventListener('click', () => {                  // Klick-Event für jede Zelle hinzuf
        const index = cell.getAttribute('data-index');          // Index der Zelle abrufen
        if (gameState[index] || checkWin()) return;         // Wenn die Zelle bereits belegt ist oder ein Spieler gewonnen hat, wird die Funktion beendet
        
        gameState[index] = currentPlayer;                   // Spielzustand aktualisieren
        cell.textContent = currentPlayer;                   // Textinhalt der Zelle aktualisieren
        cell.classList.add(currentPlayer === 'X' ? 'x-player' : 'o-player');        // Klasse hinzufügen, um das Symbol anzuzeigen
        
        if (checkWin()) {           // Überprüfen, ob ein Spieler gewonnen hat
            victoryMessage.textContent = `Spieler ${currentPlayer} gewinnt! 🎉`;         
            modal.style.display = 'block';      
            trophyImage.style.display = 'block';    
            triggerConfetti();
            if (currentPlayer === 'X') {        // Gewinner ermitteln und Gewinnzähler aktualisieren
                playerXWins++;
            } else {                            
                playerOWins++;
            }
            saveToLocalStorage();
            updateWinCounter();
        } else if (gameState.every(cell => cell)) {     // Überprüfen, ob das Spiel unentschieden ist
            victoryMessage.textContent = 'Unentschieden! 😐';
            modal.style.display = 'block';
            trophyImage.style.display = 'none'; // Trophäenbild bei Unentschieden ausblenden
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';      // Spieler wechseln
            statusText.textContent = `Spieler ${currentPlayer} ist am Zug!`;        
        }
    });
});

// Überprüfen, ob ein Spieler gewonnen hat
function checkWin() {
    return winningCombinations.some(combination => {        // some() gibt true zurück, wenn mindestens ein Element im Array die Bedingung erfüllt
        return combination.every(index => {             // every() gibt true zurück, wenn alle Elemente im Array die Bedingung erfüllen
            return gameState[index] === currentPlayer;      // Überprüfen, ob alle Zellen in der Kombination vom aktuellen Spieler belegt sind
        });
    });
}

// Neustart-Button-Event hinzufügen
restartButton.addEventListener('click', () => {
    resetGame();
});

// Event für den Spiel-Neustart-Button hinzufügen
restartGameButton.addEventListener('click', () => {
    modal.style.display = 'none';
    resetGame();
});

// Event für den Gewinnzähler-Reset-Button hinzufügen
resetWinCounterButton.addEventListener('click', () => {
    playerXWins = 0;
    playerOWins = 0;
    saveToLocalStorage();
    updateWinCounter();
});

// Event für den Schließen-Button des Modals hinzufügen
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Event für das Schließen des Modals bei Klick außerhalb des Modals hinzufügen
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Spiel zurücksetzen
function resetGame() {
    gameState.fill(null);       // Array mit null-Werten füllen
    cells.forEach(cell => {     // Jede Zelle zurücksetzen
        cell.textContent = '';
        cell.classList.remove('x-player', 'o-player');
    });
    currentPlayer = Math.random() < 0.5 ? 'X' : 'O';    // Zufällig den startenden Spieler auswählen
    statusText.textContent = `Spieler ${currentPlayer} ist am Zug!`;    
}

// Konfetti-Effekt auslösen
function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

// Beim Laden der Seite Spielstände laden und Spiel zurücksetzen
window.addEventListener('load', () => {
    loadFromLocalStorage();
    resetGame();
});

// Dunkelmodus umschalten
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}