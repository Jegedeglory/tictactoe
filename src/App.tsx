// import React, { useState } from 'react';
import './App.css'

function App() {
  
let currentPlayer: string = "X";

let gameBoard: string[] = Array.from({ length: 9 }, () => "");

let gameActive: boolean = true;


function handlePlayerTurn(clickedCellIndex: number): void {
    if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
        return;
    }
    gameBoard[clickedCellIndex] = currentPlayer;
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    checkForWinOrDraw(); 
}

const cells: NodeListOf<Element> = document.querySelectorAll('.cell');

cells.forEach((cell: Element) => {
    cell.addEventListener('click', cellClicked);
});

function cellClicked(clickedCellEvent: Event): void {
    const clickedCell: HTMLElement = clickedCellEvent.target as HTMLElement;
    const clickedCellIndex: number = parseInt(clickedCell.id.replace('cell-', '')) - 1;
   
    if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
        return;
    }
  
    handlePlayerTurn(clickedCellIndex);
    updateUI();

}

// UPDATE WHAT IS ON THE GAME
function updateUI(): void {
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i] as HTMLElement;
        cell.innerText = gameBoard[i];
    }
}

// POSSIBLE WIN CONDITIONS
const winCondition: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];


// CHECK THE RESULT OF THE GAME
function checkForWinOrDraw(): void {
    let roundWon: boolean = false;
  
    for (let i = 0; i < winCondition.length; i++) {
        const [a, b, c]: number[] = winCondition[i];
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            roundWon = true;
            break;
        }
    }
  
    if (roundWon) {
        announceWinner(currentPlayer);
        gameActive = false;
        return;
    }
  
    let roundDraw: boolean = !gameBoard.includes('');
    if (roundDraw) {
        announceDraw();
        gameActive = false;
        return;
    }
}

// ANNOUNCE RESULT OF THE GAME
function announceWinner(player: string): void {
    const messageElement: HTMLElement | null = document.getElementById('gameMessage');
    if (messageElement) {
        messageElement.innerText = `Congratulations Player ${player}, You Won!`;
        messageElement.style.backgroundColor = "#8990ad";

    }
}
  
function announceDraw(): void {
    const messageElement: HTMLElement | null = document.getElementById('gameMessage');
    if (messageElement) {
        messageElement.innerText = 'Game Draw!';
        messageElement.style.backgroundColor = "#8990ad";
    }
}

// RESET BUTTON
function resetGame(): void {
    gameBoard = Array.from({ length: 9 }, () => "");
    gameActive = true;
    currentPlayer = "X";
    cells.forEach((cell: Element) => {
      (cell as HTMLElement).innerText = "";
    });
    const messageElement: HTMLElement | null = document.getElementById('gameMessage');
    if (messageElement) {
        messageElement.innerText = "";
    }
}

const resetButton: HTMLElement | null = document.getElementById('resetButton');
if (resetButton) {
    resetButton.addEventListener('click', resetGame);
}


  return (
    <div className='Box'>
        <div id="tic-tac-toe-board">
        <div className="row">
            <div className="cell" id="cell-1"></div>
            <div className="cell" id="cell-2"></div>
            <div className="cell" id="cell-3"></div>
        </div>
        <div className="row">
            <div className="cell" id="cell-4"></div>
            <div className="cell" id="cell-5"></div>
            <div className="cell" id="cell-6"></div>
        </div>
        <div className="row">
            <div className="cell" id="cell-7"></div>
            <div className="cell" id="cell-8"></div>
            <div className="cell" id="cell-9"></div>
        </div>
    </div>
    <div id="gameMessage" className="game-message"></div>
    <button id="resetButton">Restart Game</button>
    </div>
  )
};

export default App;
