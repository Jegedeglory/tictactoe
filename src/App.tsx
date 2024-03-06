import React, { useEffect } from 'react';
import './App.css'

const App: React.FC = () => {
  
  let currentPlayer: string = "X";
  
  let gameBoard: string[] = Array.from({ length: 9 }, () => "");
  
  let gameActive: boolean = true;

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
  useEffect(() => {
    const cells: NodeListOf<Element> = document.querySelectorAll('.cell');

    cells.forEach((cell: Element) => {
        cell.addEventListener('click', cellClicked);
    });

    return () => {
        cells.forEach((cell: Element) => {
            cell.removeEventListener('click', cellClicked);
        });
    };
}, []);

function handlePlayerTurn(clickedCellIndex: number): void {
    if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
        return;
      }
      gameBoard[clickedCellIndex] = currentPlayer;
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      checkForWinOrDraw(); 
    }
    
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
  
  const cells: NodeListOf<Element> = document.querySelectorAll('.cell');
  
  cells.forEach((cell: Element) => {
      cell.addEventListener('click', cellClicked, false);
  });

function cellClicked(clickedCellEvent: Event): void {
    const clickedCell: HTMLElement = clickedCellEvent.target as HTMLElement;
    const clickedCellIndex: number = parseInt(clickedCell.id.replace('cell-', '')) - 1;
   
    if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
        return;
    }
  
    handlePlayerTurn(clickedCellIndex);
    updateUI();
    if (currentPlayer === 'O' && gameActive) {
      aiPlayer();
      setTimeout(updateUI, 1500);
}

// UPDATE WHAT IS ON THE GAME
function updateUI(): void {
  const cells: NodeListOf<Element> = document.querySelectorAll('.cell');
  for (let i = 0; i < cells.length; i++) {
      const cell: HTMLElement = cells[i] as HTMLElement;
      cell.innerText = gameBoard[i];
  }
}

// RESET BUTTON
function resetGame(): void{
    gameBoard = Array.from({ length: 9 }, () => "");
    gameActive = true;
    currentPlayer = "X";
  const cells: NodeListOf<Element> = document.querySelectorAll('.cell');

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

function aiPlayer(): void {
  // Function to check if a player can win in the next move
  function canWinNextMove(player: string): number {
      for (let i = 0; i < winCondition.length; i++) {
          const [a, b, c] = winCondition[i];
          if (
              gameBoard[a] === player &&
              gameBoard[b] === player &&
              gameBoard[c] === ''
          ) {
              return c;
          }
          if (
              gameBoard[a] === player &&
              gameBoard[c] === player &&
              gameBoard[b] === ''
          ) {
              return b;
          }
          if (
              gameBoard[b] === player &&
              gameBoard[c] === player &&
              gameBoard[a] === ''
          ) {
              return a;
          }
      }
      return -1;
  }

  // Check if AI can win in the next move
  let aiWinMove: number = canWinNextMove('O');
  if (aiWinMove !== -1) {
      handlePlayerTurn(aiWinMove);
      return;
  }

  // Check if opponent can win in the next move and block it
  let opponentWinMove: number = canWinNextMove('X');
  if (opponentWinMove !== -1) {
      handlePlayerTurn(opponentWinMove);
      return;
  }

  // Choose a random empty cell index
  let emptyCells: number[] = gameBoard.reduce((acc: number[], cell: string, index: number) => {
      if (cell === '') acc.push(index);
      return acc;
  }, []);
  function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
  if (emptyCells.length === 0) return; // No empty cells left
  let randomIndex: number = getRandomInt(0, emptyCells.length - 1);
  let chosenCellIndex: number = emptyCells[randomIndex];

  handlePlayerTurn(chosenCellIndex);
}
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
}

export default App;
