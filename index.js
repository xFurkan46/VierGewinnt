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

const cells = document.querySelectorAll('td');
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        const colIndex = index % cols;
        for (let rowIndex = rows - 1; rowIndex >= 0; rowIndex--) {
            const targetCell = cells[rowIndex * cols + colIndex];
            if (targetCell.classList.contains('empty')) {
                targetCell.classList.remove('empty');
                targetCell.classList.add(currentPlayer);
                currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
                return;
            }
        }
    });
});

