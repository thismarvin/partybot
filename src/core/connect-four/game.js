const { Board, CanvasHelper } = require("../../lib/connect-four/index.js");

class Game {
	get turns() {
		return this.board.turns;
	}

	get canvas() {
		return this.board.createCanvas();
	}

	get winCondition() {
		const currentPiece = this.turns % 2 === 0 ? 2 : 1;
		return this.board.winCondition(currentPiece);
	}

	constructor(challenger, opponent) {
		this.type = "CONNECT_FOUR";
		this.challenger = challenger;
		this.opponent = opponent;
		this.board = new Board();
	}

	process(message) {
		const x = parseInt(message) - 1;

		return this.board.dropPieceAt(x);
	}
}

module.exports = Game;
