import prompt from 'sync-input';
import { Gameboard, Cell, GameController } from './GameController.js';
function ConsoleGameController() {
    const game = GameController();

    // We get the Default Names. These are set when we create "GameController"(line above),
    // or is left blank they are defaulted in constructor of "GameController"
    let playerOneName = game.getPlayers()[0].name;
    let playerTwoName = game.getPlayers()[1].name;

    const pOne = prompt(`${playerOneName}'s Please enter your name: `);
    const pTwo = prompt(`${playerTwoName}'s Please enter your name: `);
    game.setPlayerName(0, pOne)
    game.setPlayerName(1, pTwo)

    // while (roundsPlayed < maxRounds) {
    while (true) {
        let position;
        position = prompt(`${game.getActivePlayer().name}'s turn. Choose your current position: `);
        const result = game.playRound(position);

        if (result === "invalidMove") {
            console.log(`That square is already taken. Try again`);
        } else {
            if (result === "win") {
                console.log(`We have a winner ${game.getActivePlayer().name}`)
            }
            if (result === "tie") {
                console.log(`We have a Tie`)
            }

            // The games end after maxRounds have been played. so we check it here
            const gameResult = game.checkGameEnd();
            if (gameResult) {
                if (game.getPlayers()[0].roundsWon > game.getPlayers()[1].roundsWon) {
                    console.log("------------------------------------------------------------------------------")
                    console.log(`${game.getPlayers()[0].name} (${game.getPlayers()[0].token}) has won the game!`);
                    console.log(`${game.getPlayers()[0].name} :  ${game.getPlayers()[0].roundsWon}`);
                    console.log(`${game.getPlayers()[1].name} :  ${game.getPlayers()[1].roundsWon}`);
                    console.log("------------------------------------------------------------------------------")
                } else if (game.getPlayers()[0].roundsWon < game.getPlayers()[1].roundsWon) {
                    console.log("------------------------------------------------------------------------------")
                    console.log(`${game.getPlayers()[1].name} (${game.getPlayers()[1].token}) has won the game!`);
                    console.log(`${game.getPlayers()[1].name} :  ${game.getPlayers()[1].roundsWon}`);
                    console.log(`${game.getPlayers()[0].name} :  ${game.getPlayers()[0].roundsWon}`);
                    console.log("------------------------------------------------------------------------------")
                } else {
                    console.log("The game is a tie!");
                }

                break;
            }
        }
    }
}

export default ConsoleGameController;