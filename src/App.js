import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    // The condition: The if statement essentially checks if squares[i] has a truthy value. In JavaScript, any value except false, 0, "" (empty string), null, or undefined is considered truthy.
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    // if (squares[i] == null) //->  the alternate way to write the same above if condition is to put the whole cose of below inside this if condition.
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner : " + winner;
  } else {
    status = "Next Player : " + (xIsNext ? "X" : "O");
  }
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square
          value={squares[0]}
          onSquareClick={() => {
            handleClick(0);
          }}
        />
        <Square
          value={squares[1]}
          onSquareClick={() => {
            handleClick(1);
          }}
        />
        <Square
          value={squares[2]}
          onSquareClick={() => {
            handleClick(2);
          }}
        />
      </div>
      <div className="board-row">
        <Square
          value={squares[3]}
          onSquareClick={() => {
            handleClick(3);
          }}
        />
        <Square
          value={squares[4]}
          onSquareClick={() => {
            handleClick(4);
          }}
        />
        <Square
          value={squares[5]}
          onSquareClick={() => {
            handleClick(5);
          }}
        />
      </div>
      <div className="board-row">
        <Square
          value={squares[6]}
          onSquareClick={() => {
            handleClick(6);
          }}
        />
        <Square
          value={squares[7]}
          onSquareClick={() => {
            handleClick(7);
          }}
        />
        <Square
          value={squares[8]}
          onSquareClick={() => {
            handleClick(8);
          }}
        />
      </div>
    </>
  );
}

export default function Game() {
  /* const [xIsNext, setXIsNext] = useState(true);
    >  The code currently stores both currentMove (position in history) and xIsNext (which player's turn) as separate state variables.
    > Observation reveals a relationship between them: xIsNext is true for even currentMove values and false for odd values.
    > Keeping both variables introduces redundancy, potentially leading to bugs and making the code harder to maintain.
    > The solution proposes removing xIsNext from the state and calculating it based on currentMove when needed.
  */

  const [currentMove, setCurrentMove] = useState(0); // created a new state variable to keep track of which step the user is currently viewing

  const [history, setHistory] = useState([Array(9).fill(null)]);

  const xIsNext = currentMove % 2 === 0;
  /*
    1.If nextMove is even (divisible by 2), the expression evaluates to true. In this case, setXIsNext is set to true, indicating it's Player X's turn.
    2.If nextMove is odd, the expression evaluates to false. Here, setXIsNext is set to false, signifying Player O's turn.
  */

  const currentSquares = history[currentMove]; // this will store the currentHistory array from the history array.

  function handlePlay(nextSquares) {
    // argument(nextSquares) likely represents an array containing the updated board state after a player makes a move.

    // spread operator -> iska mtlb ye hai ki phle se history array me jitne bhi elements hai wo sab starting se store krdo isme fir uske bad end me nextSquares array bhi dalo do comma tells this.
    // setHistory([...history, nextSquares]); // old code according to above explanation.

    // updated code according to the below explanation.
    /* This part takes a slice of the history array, including elements from the beginning up to (but not including) the index currentMove + 1. This ensures all moves up to the current one are included in the new history. */
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]; // The spread operator (...) spreads those elements from the slice into a new array.

    /* This line updates the history state variable using the setHistory function. It sets it to the newly constructed nextHistory array, incorporating the latest move into the game's history. */
    setHistory(nextHistory);

    /* This line updates the currentMove state variable using the setCurrentMove function. It sets it to the length of the nextHistory array minus 1, effectively pointing to the newly added move as the current one. */
    setCurrentMove(nextHistory.length - 1);
  }

  // This function will help you in moving back to the previous steps.
  // jumpTo that takes a single argument nextMove. This argument represents the index of the move in the game history that the user wants to jump to.
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // In JavaScript, to transform one array into another, you can use the array map method
  /* The map function takes a callback function as an argument. This callback function is executed for each element (a move) in the history array.
  -> CallBack function receives two arguments:
      1.squares: This likely contains the state of the board at the time of the move.
      2.move: This represents the index of the current move within the history array (starts from 0).
  */
  const moves = history.map((squares, move) => {
    let description; // This will store the text displayed for each move in the list.
    if (move === 0) {
      description = "Go to game start";
    } else {
      description = "Go to move #" + move;
    }
    return (
      // sequential number of the move. Moves will never be re-ordered, deleted, or inserted in the middle, so it’s safe to use the move index as a key.
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]; // This line uses destructuring assignment to extract three values from the current element (lines[i]) of the lines array and assign them to constants a, b, and c.

    //-> This line defines an if statement that checks for a winning condition.
    // > squares[a]: This checks if the value at index a in the squares array (representing the board state) has a value (not empty).
    // > squares[a] === squares[b] && squares[a] === squares[c]: This checks if the values at indices a, b, and c in the squares array are all equal. This implies that all three squares in the current winning combination (lines[i]) have the same value ('X' or 'O').
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a]; // If a winning combination is found (if condition is true), the loop immediately returns the value (squares[a]), which represents the winning player ('X' or 'O'). This early return stops further iterations through other potential winning combinations.
    }
  }
  return null;
}
