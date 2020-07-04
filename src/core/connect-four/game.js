const {Board, CanvasHelper} = require("../../lib/connect-four/index.js");

class Game {
	get turns() {
		return this.board.turns;
	}

	constructor(challenger, opponent){
		this.type = "CONNECT_FOUR";
		this.challenger = challenger;
		this.opponent = opponent;
		this.board = new Board();
	}

	process(message) {

	}
}

module.exports = Game;