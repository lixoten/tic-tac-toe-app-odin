import { GameController } from './GameController.js';

function ScreenGameController() {
    const game = GameController();
    let isRoundOver = false;

    const maxRounds = game.getMaxRounds().toString();

    const elements = {
        countdownRounds: document.getElementById("countdown"),
        totalRoundsDialog: document.getElementById("total-rounds"),
        showDialogButton: document.getElementById("show-dialog-button"),
        gameRestartButton: document.getElementById("game-restart-button"),
        restartNextButton: document.getElementById("restart-next-button"),
        msgWinner: document.querySelector(".msg-winner"),
        msgArea: document.querySelector(".msg-area"),
        turnMsg: document.querySelectorAll(".turn"),
        playerScore: document.querySelectorAll(".player-score"),

        board: document.getElementById("board"),
        playerName: document.querySelectorAll(".player-name"),
        saveDialogButton: document.getElementById("save-dialog-button"),
        popupDialog: document.getElementById("popup-dialog"),
        myForm: document.getElementById("my-form"),
        closeDialogButton: document.getElementById("close-dialog"),
        rounds: document.querySelector("#total-rounds"),
        output: document.querySelector(".rounds-output")
    };
    // Taken out.... Do not show it by default
    // elements.popupDialog.showModal();

    // We set names for both players that are displayed on screen(left and right of tic-tac-toe squares)
    let playerOneName = game.getPlayers()[0].name;
    let playerTwoName = game.getPlayers()[1].name;
    elements.playerName[0].textContent = playerOneName
    elements.playerName[1].textContent = playerTwoName

    const resetSquares = () => {
        document.querySelectorAll(".cell").forEach(cell => cell.innerHTML = '');
        //const cellElements = document.querySelectorAll(".cell");
        //for (let cellEle of cellElements) {
        //    cellEle.innerHTML = '';
        //}

        elements.msgWinner.textContent = ``;
        elements.msgArea.textContent = ``;
        elements.turnMsg[0].textContent = "You start";
        elements.turnMsg[1].textContent = "";
        isRoundOver = false;

        elements.restartNextButton.textContent = "Restart Round...";
        game.setClearBoard();
    }

    const displayRoundsLeft = () => {
        const max = game.getMaxRounds();
        elements.countdownRounds.textContent = (max - game.getRoundPlayed()).toString();
    }

    elements.showDialogButton.addEventListener("click", () =>{
        elements.popupDialog.showModal();
    })

    elements.gameRestartButton.addEventListener("click", () =>{
        elements.playerScore[0].textContent = "0";
        elements.playerScore[1].textContent = "0";
        elements.restartNextButton.style.display = "block";
        game.resetEverything()

        elements.countdownRounds.textContent = maxRounds;

        resetSquares()
    })

    elements.restartNextButton.addEventListener("click", resetSquares);

    elements.saveDialogButton.addEventListener("click", (event) => {
        event.preventDefault();
        if (!elements.myForm.checkValidity()) {
            elements.myForm.reportValidity();
            return;
        }
        const playerOneDialogElement = document.getElementById("player-one")
        const playerTwoDialogElement = document.getElementById("player-two")

        // We update names for both players that are displayed on screen(left and right of tic-tac-toe squares)
        elements.playerName[0].textContent = playerOneDialogElement.value;
        elements.playerName[1].textContent = playerTwoDialogElement.value;

        // We save it to the Player Class, so we have it handy in case we need it again
        game.setPlayerName(0, playerOneDialogElement.value);
        game.setPlayerName(1, playerTwoDialogElement.value);
        game.setMaxRounds(elements.totalRoundsDialog.value);

        displayRoundsLeft();

        // This one here local scope. For use in messages. Nicer than using player properties over and over
        playerOneName = playerOneDialogElement.value;
        playerTwoName = playerTwoDialogElement.value;

        elements.popupDialog.close();
    });

    elements.board.addEventListener("click", (event) => {
        if (isRoundOver) return;

        const clickedElement = event.target;

        let activePlayerToken = game.getActivePlayer().token;
        let activePlayerName = game.getActivePlayer().name;

        const move = clickedElement.dataset.index;
        const result = game.playRound(move);
        //token = result = game.getActivePlayer().token;
        //name = result = game.getActivePlayer().name;

        if (result === "invalidMove") {
            // Never happens but just in-case...
            console.log(`That square is already taken. Try again`);
        } else {
            //..clickedElement.textContent = game.getActivePlayer().token;
            clickedElement.textContent = activePlayerToken;

            if (result === "win") {
                isRoundOver = true;
                //console.log(`We have a winner ${game.getActivePlayer().name}`)
                elements.msgArea.textContent = `This Round was won by ${activePlayerName}`;
                elements.msgArea.classList.add('fade-out');
                setTimeout(() => {
                    elements.msgArea.textContent = '';
                    elements.msgArea.classList.remove('fade-out');
                }, 3000);
                elements.restartNextButton.textContent = "Next Round...";

                const max = game.getMaxRounds();
                elements.countdownRounds.textContent = (max - game.getRoundPlayed()).toString();


                elements.playerScore[0].textContent = game.getPlayers()[0].roundsWon;
                elements.playerScore[1].textContent = game.getPlayers()[1].roundsWon;
                elements.turnMsg[0].textContent = "";
                elements.turnMsg[1].textContent = "";

            } else  if (result === "tie") {
                isRoundOver = true;
                //console.log(`We have a Tie`)
                elements.msgArea.textContent = `This round is a Tie`;
                elements.msgArea.classList.add('fade-out');
                setTimeout(() => {
                    elements.msgArea.textContent = '';
                    elements.msgArea.classList.remove('fade-out');
                }, 3000);

            } else {
                if (activePlayerToken === "x"){
                    elements.turnMsg[1].textContent = "Your turn";
                    elements.turnMsg[0].textContent = "";
                } else {
                    elements.turnMsg[0].textContent = "Your turn";
                    elements.turnMsg[1].textContent = "";
                }
            }

            const gameResult = game.checkGameEnd();
            if (gameResult) {
                if (game.getPlayers()[0].roundsWon > game.getPlayers()[1].roundsWon) {
                    elements.msgWinner.textContent = `${playerOneName} (${game.getPlayers()[0].token}) has won the game!`;
                } else if (game.getPlayers()[0].roundsWon < game.getPlayers()[1].roundsWon) {
                    elements.msgWinner.textContent = `${playerTwoName} (${game.getPlayers()[1].token}) has won the game! ${playerTwoName}`;
                } else {
                    elements.msgWinner.textContent += `Final result. The game is a tie!`;
                }

                elements.restartNextButton.style.display = "none";
            }
        }
    })

    elements.closeDialogButton.addEventListener("click", (event) => {
        event.preventDefault();
        elements.popupDialog.close();
    });

    document.addEventListener('click', function(event) {
        let isClickOutside = elements.popupDialog.contains(event.target);

        if ((event.target === elements.popupDialog && isClickOutside) && elements.popupDialog.open) {
            elements.popupDialog.close();
        }
    });

    // inside the dialog we have an input type range. this is the output for it
    elements.rounds.addEventListener("input", () => {
        elements.output.textContent = elements.rounds.value;
    });

    // Initialization Code
    displayRoundsLeft()
    elements.output.textContent = game.getMaxRounds().toString();
    resetSquares()
}

ScreenGameController();
// 205