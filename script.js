const boardSize = 10;
const mineCount = 10;
let board = [];

function initializeBoard() {
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));

    for (let i = 0; i < mineCount; i++) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);

        if (board[row][col] !== 'M') {
            board[row][col] = 'M';
        } else {
            i--;
        }
    }
}

function updateBoardDisplay() {
    const table = document.getElementById('minesweeper-board');
    table.innerHTML = ''; // Clear previous content

    for (let i = 0; i < boardSize; i++) {
        const row = document.createElement('tr');

        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('td');
            const select = document.createElement('select');

            const option1 = document.createElement('option');
            option1.value = '1';
            select.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = '2';
            option2.innerHTML = '👆';
            select.appendChild(option2);


            const option3 = document.createElement('option');
            option3.value = '3';
            option3.innerHTML = '🚩';
            select.appendChild(option3);


            cell.appendChild(select);
            row.appendChild(cell);
        }

        table.appendChild(row);
    }


    // add the event listener
    table.querySelectorAll('select').forEach(function (select) {
        select.addEventListener('change', function (event) {
            const cell = select.closest('td');

            if (cell) {
                const rowIndex = cell.parentNode.rowIndex;
                const colIndex = cell.cellIndex;

                console.log(`Changed cell (${rowIndex}, ${colIndex}) to value: ${select.value}`);
                console.log(board[rowIndex][colIndex])

                // Check if the changed select is on a mine
                if (board[rowIndex][colIndex] === "M" && select.value === '2') {
                    console.log('Game over!');

                    // make background of the select red
                    select.style.backgroundColor = 'red';


                    // Change the first option of all selects on mines to bomb emoji
                    table.querySelectorAll('select').forEach(function (mineSelect) {
                        const mineCell = mineSelect.closest('td');
                        const mineRowIndex = mineCell.parentNode.rowIndex;
                        const mineColIndex = mineCell.cellIndex;
                        mineSelect.disabled = true;

                        if (board[mineRowIndex][mineColIndex] === "M") {

                            mineSelect.value = '1';
                            mineSelect.querySelector('option[value="1"]').textContent = '💣';

                        } else if (board[mineRowIndex][mineColIndex] === "f") {

                            mineSelect.value = '1';
                            mineSelect.querySelector('option[value="1"]').textContent = '❌';

                        }

                    });






                } else if (board[rowIndex][colIndex] === "M" && select.value === '3') {

                    // change the value of the cell to flagged
                    board[rowIndex][colIndex] = "t"


                } else if (board[rowIndex][colIndex] === 0 && select.value === '3') {

                    board[rowIndex][colIndex] = "f"





                } else if (board[rowIndex][colIndex] === 0 && select.value === '2') {
                    const minesAround = countMinesAround(rowIndex, colIndex);

                    console.log(minesAround)

                    if (minesAround !== 0) {

                        // Update the select with the number of mines around
                        select.value = 1;
                        select.querySelector(`option[value="${1}"]`).textContent = minesAround.toString();


                        board[rowIndex][colIndex] = "r"
                        select.disabled = true;

                        console.log(`revealed (${rowIndex}, ${colIndex}) with ${minesAround} mines around`);

                    } else if (minesAround == 0) {
                        select.value = '1';

                        select.disabled = true;
                        revealEmptyCells(rowIndex, colIndex);
                    }

                }



            }
        });
    });

}
function countMinesAround(row, col) {
    let minesAround = 0;

    // Check for mines in the adjacent cells
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;

            // Skip the cell itself
            if (i === 0 && j === 0) {
                continue;
            }

            // Check edges
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                if (board[newRow][newCol] === "M" || board[newRow][newCol] === "t") {
                    minesAround++;
                }
            }
        }
    }

    return minesAround;
}


function revealEmptyCells(row, col) {
    // Check edges
    if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) {
        return;
    }

    // Check if the cell is already revealed or flagged
    if (board[row][col] === 'r' || board[row][col] === 't' || board[row][col] === 'f') {
        return;
    }

    board[row][col] = 'r';

    // Update the select with the number of mines around
    const cell = document.querySelector(`#minesweeper-board tr:nth-child(${row + 1}) td:nth-child(${col + 1})`);
    const select = cell.querySelector('select');
    const minesAround = countMinesAround(row, col);

    if (minesAround !== 0) {
        select.value = 1;
        select.querySelector(`option[value="${1}"]`).textContent = minesAround.toString();
        board[row][col] = 'r';


    } else {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                revealEmptyCells(row + i, col + j);
            }
        }
    }

    select.disabled = true;

}

initializeBoard();
updateBoardDisplay();
