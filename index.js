const rows = 6;
const cols = 7;
let player1Wins = 0;
let player2Wins = 0;


const gameBoard = document.getElementById('game-board');
const modal = document.getElementById('victory-modal');
const closeButton = document.querySelector('.close-button');
const victoryMessage = document.getElementById('victory-message');
const restartGameButton = document.getElementById('restart-game-button');
const trophyImage = document.getElementById('trophy-image');


//comment


const table = document.createElement('table');
table.setAttribute('border', '1');
table.setAttribute('cellspacing', '0');
table.setAttribute('cellpadding', '0');

const tbody = document.createElement('tbody');

for (let i = 0; i < rows; i++) {                        //erstellt die Zeilen
    const tr = document.createElement('tr');            
    for (let j = 0; j < cols; j++) {
        const td = document.createElement('td');        
        td.classList.add('empty');                      //fügt der Zelle die Klasse empty hinzu
        tr.appendChild(td);
    }
    tbody.appendChild(tr);
}

table.appendChild(tbody);                        //erstellt das Spielfeld
gameBoard.appendChild(table);                   //fügt das Spielfeld in das HTML ein

let currentPlayer = 'player1';
let isGameOver = false;                     //Schaut das Spielzustand an

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
                targetCell.classList.add(currentPlayer , 'fall');

                makeMove(targetCell);

                if (checkWin()) {                                       //wenn ein spieler gewinnt, das Spiel beenden oder neu starten
                    setTimeout(() => {
                        victoryMessage.textContent = `Victory for ${currentPlayer === 'player1' ? 'Player 1 (Green)' : 'Player 2 (Red)'}!`;
                        modal.style.display = 'block';                   //zeigt die Modal Box an
                        trophyImage.style.display = 'block';             //zeigt das Bild an

                        triggerConfetti();                              //feiert den Sieg mit Konfetti

                        if (currentPlayer === 'player1') {          //Zählt die Siege von jedem Spieler
                            player1Wins++;
                        } else {
                            player2Wins++;
                        }
                        updateWinCounter();
                        saveToLocalStorage();

                        isGameOver = true;                              //Spiel beendet keine weiteren Züge möglich
                    }, 100);
                    return;
                }
                if (isBoardFull()) {                            //Wenn das Board voll ist und kein Spieler gewonnen hat, ist es ein Unentschieden
                    setTimeout(() => {
                        alert('Unentschieden!');                //alert box für unentschieden
                        isGameOver = true;
                    }, 100);
                    return;
                }
                currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';  // wechselt den spieler
                updateCurrentPlayerDisplay();                    //aktualisiert die Anzeige des aktuellen Spielers
                return;
            }
        }
    });
});






function checkWin() {
    return checkHorizontalWin() || checkVerticalWin() || checkDiagonalWin() || checkDiagonalWin2();
}




//funktion check horizontal 
function checkHorizontalWin() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols - 3; col++) {
            const cell1 = cells[row * cols + col];               //cells ist eine Liste von allen Zellen
            const cell2 = cells[row * cols + col + 1];           //const cell ist die variable die die Zelle speichert und die Zelle wird durch die Zeile und die Spalte identifiziert
            const cell3 = cells[row * cols + col + 2];
            const cell4 = cells[row * cols + col + 3];
            if (
                !cell1.classList.contains('empty') &&
                cell1.classList.contains(currentPlayer) &&      //schaut ob die Zelle dem aktuellen Spieler gehört
                cell2.classList.contains(currentPlayer) &&      //schaut ob die restlichen drei auch dem aktuellen Spieler gehören
                cell3.classList.contains(currentPlayer) &&
                cell4.classList.contains(currentPlayer)         //class list kann man benutzen um die Klassen einer Zelle zu überprüfen hinzuzufügen oder zu entfernen
            ) {
                return true;
            }
        }
    }
    return false;
}


//funktion check vertikal
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
    for (let row = 0; row < rows - 3; row++){
        for (let col = 0; col < cols - 3; col++){
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
    for (let row = 0; row < rows - 3; row++){
        for (let col = 3; col < cols; col++){
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

window.addEventListener('load', () => {          // Initialisiere das Spiel beim Laden der Seite
    loadFromLocalStorage();
    resetGame();
});                             

//cleart das board und setzt die Spielerzüge zurück
function resetGame() {
    cells.forEach(cell => {
        cell.classList.remove('player1', 'player2', 'fall');
        cell.classList.add('empty');
    });

    player1Moves = 0;
    player2Moves = 0;

    currentPlayer =  Math.random() < 0.5 ? 'player1' : 'player2'; //randomisiert welcher Spieler anfängt

    updateMoveCounter();
    updateCurrentPlayerDisplay();

    isGameOver = false; //setzt das Spiel zurück auf false

    console.log('Game Restarted');
}

currentPlayer =  Math.random() < 0.5 ? 'player1' : 'player2'; //randomisiert welcher Spieler anfängt


function updateCurrentPlayerDisplay() {
    const currentPlayerName = currentPlayer === 'player1' ? 'Spieler 1 (Green)' : 'Spieler 2 (Red)';
    document.getElementById('current-player-name').textContent = currentPlayerName;
}


function updateMoveCounter() {
    document.getElementById('player1-moves').textContent = `${player1Moves} (Green)`; //zeigt die Anzahl der Züge an von Spieler Red und Green
    document.getElementById('player2-moves').textContent =  `${player2Moves} (Red)`; 
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

// Win Counter
document.getElementById('reset-win-counter').addEventListener('click',() => {           //reset button für die Siege
    resetWinCounter();
    saveToLocalStorage();
});

function resetWinCounter() {            //setzt die Siege der Spieler zurück
    player1Wins = 0;
    player2Wins = 0;
    updateWinCounter();
    saveToLocalStorage();
}

function isBoardFull() {
    return [...cells].every(cell => !cell.classList.contains('empty'));         //schaut ob das Board voll ist
}


function saveToLocalStorage () {
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


closeButton.addEventListener('click', () => {           //schließt das modal
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {       //schließt das modal
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

restartGameButton.addEventListener('click', () => {         //restart button
    modal.style.display = 'none';
    resetGame();
});

function highlightWinningCells(winningCells) {
    winningCells.forEach(cell => {
        cell.classList.add('winning-cell');
    });
}








/*TODO: Restart Button             -------------------------------schon gemacht
    gameOver statement True false  -------------------------------schon gemacht
    Counter von Spielerzügen        -------------------------------schon gemacht
    Anzeige welche spieler dran ist -------------------------------schon gemacht
    Win Counter für beide Spieler -mit reset button  -------------------------------schon gemacht
    Design verbessern                       -------------------------------schon ein bisschen gemacht
    Local Storage für Win Counter, Spielerzüge, board  ------------------------------- Win Counter und Spielerzüge schon gemacht 
    Ai hinzufügen
    Animationen hinzufügen                                  -------------------------------schon gemacht
    */