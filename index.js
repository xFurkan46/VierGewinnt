const rows = 6;
const cols = 7;

const gameBoard = document.getElementById('game-board');
//comment


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
                targetCell.classList.add(currentPlayer);
                if (checkWin()) {                                       //wenn ein spieler gewinnt, das Spiel beenden oder neu starten
                    setTimeout(() => {
                        alert(`${currentPlayer} gewinnt!`);
                        isGameOver = true;                              //Spiel beendet keine weiteren Züge möglich
                    }, 100);
                    return;
                }
                currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';  // wechselt den spieler
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

/*function updateMoveCounter() {
    if(currentPlayer === 'player1') {
        player1Moves++;
        player1Counte
    } else {
} /*




/*TODO: Restart Button
    gameOver statement True false  -------------------------------schon gemacht
    Counter von Spielerzügen
    Anzeige welche spieler dran ist
    Win Counter für beide Spieler -mit reset button
    Design verbessern
    Local Storage für Win Counter, Spielerzüge, board
    Ai hinzufügen
    Animationen hinzufügen
    */