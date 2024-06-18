class PlayerController {
    constructor() {
        this.players = [];
    }

    createPlayer(name, token) {
        const player = {
            name: name,
            token: token,
            roundsWon: 0
        };
        this.players.push(player);
        return player;
    }

    getPlayer(index) {
        if (index < 0 || index >= this.players.length) {
            throw new Error('Invalid player index');
        }
        return this.players[index];
    }

    setPlayerName(index, newName) {
        if (index < 0 || index >= this.players.length) {
            throw new Error('Invalid player index');
        }
        this.players[index].name = newName;
    }

    getPlayers() {
        return this.players;
    }

    resetRoundsWon(index) {
        if (index < 0 || index >= this.players.length) {
            throw new Error('Invalid player index');
        }
        this.players[index].roundsWon = 0;
    }

}


export default PlayerController;
// module.exports = PlayerController;