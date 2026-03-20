// Frame Enforcement Logic
if (window.self === window.top) {
    window.open("../", "_self");
    // If NOT in an iframe, hide the content and show an error
    document.body.innerHTML = `
        <div style="display:flex; justify-content:center; align-items:center; height:100vh; color:white; text-align:center; padding:20px;">
            <h1>Access Denied</h1>
            <p>This application can only be accessed when embedded in an authorized iframe.</p>
        </div>
    `;
    // Stop any further script execution
    throw new Error("This page must be viewed in an iframe.");
}

const boardElement = document.getElementById('chessboard');
const turnIndicator = document.getElementById('turn-indicator');

// Unicode chess pieces
const pieces = {
    w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
    b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
};

// 8x8 Board State (Initial Setup)
let boardState = [
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
];

let selectedSquare = null;
let currentTurn = 'w'; // 'w' for White, 'b' for Black

// Initialize the visual board
function renderBoard() {
    boardElement.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            // Alternate colors
            square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
            square.dataset.row = row;
            square.dataset.col = col;

            const pieceCode = boardState[row][col];
            if (pieceCode) {
                const color = pieceCode[0];
                const type = pieceCode[1];
                square.textContent = pieces[color][type];
                square.style.color = color === 'w' ? '#fff' : '#000'; 
                if(color === 'w') square.style.textShadow = "0px 0px 2px #000";
            }

            square.addEventListener('click', () => handleSquareClick(row, col));
            boardElement.appendChild(square);
        }
    }
}

function handleSquareClick(row, col) {
    const clickedPiece = boardState[row][col];

    // If we already have a piece selected
    if (selectedSquare) {
        const [selRow, selCol] = selectedSquare;

        // Clicked own piece again -> switch selection
        if (clickedPiece && clickedPiece[0] === currentTurn) {
            selectedSquare = [row, col];
            highlightSelection(row, col);
            return;
        }

        // Execute move (still allowing free movement anywhere for now)
        executeMove(selRow, selCol, row, col);
        
    } else {
        // Select a piece if it belongs to the current player
        if (clickedPiece && clickedPiece[0] === currentTurn) {
            selectedSquare = [row, col];
            highlightSelection(row, col);
        }
    }
}

function highlightSelection(row, col) {
    renderBoard(); // Clear previous highlights
    const index = row * 8 + col;
    boardElement.children[index].classList.add('selected');
}

function executeMove(fromRow, fromCol, toRow, toCol) {
    // Move piece in state
    boardState[toRow][toCol] = boardState[fromRow][fromCol];
    boardState[fromRow][fromCol] = '';
    
    selectedSquare = null;
    currentTurn = currentTurn === 'w' ? 'b' : 'w';
    
    // Updated turn text for human vs human
    turnIndicator.textContent = currentTurn === 'w' ? "White's Turn" : "Black's Turn";
    
    renderBoard();
}

// Start the game
renderBoard();