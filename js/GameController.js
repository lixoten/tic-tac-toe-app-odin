import PlayerController from './PlayerController.js';

//const prompt = require("sync-input");
function Gameboard() {
    let boardArray = [];

    const setClearBoard = () =>{
        boardArray = [];
        for (let i = 0; i < 9; i++) {
            boardArray.push(Cell());
        }
    }

    setClearBoard();


    const getBoard = () => boardArray;

    const makeMove = (cell, marker) => {
        if (boardArray[cell].getValue() === null) {
            boardArray[cell].addToken(marker);
            return true;
        } else {
            return false;
        }
    }

    const printBoard = () => {
        let boardString = "";

        for (let i = 0; i < boardArray.length; i++) {
            const v = boardArray[i].getValue() === "x"? "x" : boardArray[i].getValue() === "o"? "o" : " ";
            if (i === 0) {
                boardString += " | "
                boardString += v;
                boardString += " | "
            } else if (i % 3 === 0) {
                boardString += "\n"
                boardString += " | "
                boardString += v;
                boardString += " | "
            } else {
                boardString += v;
                boardString += " | "
            }

        }
        console.log("------------------------------------------------------------------");
        console.log(boardString);
    };

    return { getBoard, makeMove, printBoard, setClearBoard };
}


function Cell() {
    let value = null;

    const addToken = (mark) => {
        value = mark;
    };

    const getValue = () => value;

    return {
        value,
        addToken,
        getValue
    };
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two",
    maxRounds = 3

) {
    const board = Gameboard();
    let roundsPlayed = 0;
    // let isRoundOver = false;

    const playerController = new PlayerController();
    playerController.createPlayer(playerOneName, "x");
    playerController.createPlayer(playerTwoName, "o");

    let activePlayer = playerController.getPlayer(0);

    const resetEverything = () => {
        playerController.setPlayerName(0, "");
        playerController.setPlayerName(1, "");
        game.setPlayerName(1, "");
        board.setClearBoard()
        playerController.resetRoundsWon(0);
        playerController.resetRoundsWon(1);
        roundsPlayed = 0;
    }

    const setMaxRounds = (value) => {
        maxRounds = value;
    }

    const getMaxRounds = () => maxRounds;
    const getRoundPlayed = () => roundsPlayed;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === playerController.getPlayer(0) ? playerController.getPlayer(1) : playerController.getPlayer(0);
    };
    const getActivePlayer = () => activePlayer;

    const getPlayers = () => playerController.getPlayers();

    const printNewRound = () => {
        board.printBoard();
        // Save - uncomment for test
        // console.log(`Test: ${getActivePlayer().name}'s turn.`);
    };

    const checkWinner = () => {
        const winningCombinations  = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        const boardArray = board.getBoard()
        for (let cellSet of winningCombinations) {
            if (boardArray[cellSet[0]].getValue()!== null &&
                boardArray[cellSet[0]].getValue() === boardArray[cellSet[1]].getValue() &&
                boardArray[cellSet[0]].getValue() === boardArray[cellSet[2]].getValue()) {
                return true;
            }
        }

        return false;
    }

    const checkTie = () => {
        const boardArray = board.getBoard();
        return !boardArray.some(cell => cell.getValue() === null);
    }

    const checkGameEnd = () => {
        if (roundsPlayed >= maxRounds) {
            return true;
        }
        return false;
    };

    const playRound = (column) => {
        // Save - uncomment for test
        // console.log(`Test: Making  ${getActivePlayer().name}'s token into cell ${column}...`);

        const validMove = board.makeMove(column - 1, getActivePlayer().token);
        if (!validMove) {
            printNewRound();
            // Save - uncomment for test
            // console.log(`Test: That square is already taken. Try again`);
            return "invalidMove";
        }

        /*  This is where we would check for a winner and handle that logic,
            such as a win message. */
        const winner = checkWinner();
        if (winner === true) {
            printNewRound();
            // Save - uncomment for test
            // console.log(`Test: We have a winner`);
            getActivePlayer().roundsWon++;
            activePlayer = playerController.getPlayer(0);
            board.setClearBoard()
            roundsPlayed++;
            return "win";
        } else {
            const tie = checkTie();
            if (tie === true) {
                // Save - uncomment for test
                // console.log("Test: The game is a tie!");
                board.setClearBoard()
                roundsPlayed++;
                return "tie";
            }
        }


        // Call checkGameEnd at the end of each round
        // const endGame = checkGameEnd();
        // if (endGame !== null) {
        //     console.log("GAME OVER");
        //     return;
        // }

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        checkGameEnd,
        getPlayers,
        setPlayerName: playerController.setPlayerName.bind(playerController),
        getActivePlayer,
        getBoard: board.getBoard,
        setClearBoard: board.setClearBoard,
        resetEverything,
        setMaxRounds,
        getMaxRounds,
        getRoundPlayed,
    };
}

export { Gameboard, Cell, GameController };

const game = GameController()