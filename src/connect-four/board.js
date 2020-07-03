const DIRECTION = {
	UP: { x: 0, y: -1 },
	UP_RIGHT: { x: 1, y: -1 },
	RIGHT: { x: 1, y: 0 },
	DOWN_RIGHT: { x: 1, y: 1 },
	DOWN: { x: 0, y: 1 },
	DOWN_LEFT: { x: -1, y: 1 },
	LEFT: { x: -1, y: 0 },
	UP_LEFT: { x: -1, y: -1 },
};

class Board {
	constructor(rows = 6, columns = 7, target = 4) {
		this.rows = rows;
		this.columns = columns;
		this.state = new Array(this.rows * this.columns).fill(0);
		this.turns = 0;
		this.target = target;
	}

	get(x, y) {
		return this.state[this.columns * y + x];
	}

	set(x, y, value) {
		this.state[this.columns * y + x] = value;
	}

	getAdjacentDirections(x, y) {
		const result = [];
		const targetPiece = this.get(x, y);

		if (x > 0 && this.get(x - 1, y) === targetPiece) {
			result.push(DIRECTION.LEFT);
		}
		if (x < this.columns - 1 && this.get(x + 1, y) === targetPiece) {
			result.push(DIRECTION.RIGHT);
		}
		if (y > 0 && this.get(x, y - 1) === targetPiece) {
			result.push(DIRECTION.UP);
		}
		if (y < this.rows - 1 && this.get(x, y + 1) === targetPiece) {
			result.push(DIRECTION.DOWN);
		}
		if (y > 0 && x > 0 && this.get(x - 1, y - 1) === targetPiece) {
			result.push(DIRECTION.UP_LEFT);
		}
		if (
			y > 0 &&
			x < this.columns - 1 &&
			this.get(x + 1, y - 1) === targetPiece
		) {
			result.push(DIRECTION.UP_RIGHT);
		}
		if (y < this.rows - 1 && x > 0 && this.get(x - 1, y + 1) === targetPiece) {
			result.push(DIRECTION.DOWN_LEFT);
		}
		if (
			y < this.rows - 1 &&
			x < this.columns - 1 &&
			this.get(x + 1, y + 1) === targetPiece
		) {
			result.push(DIRECTION.DOWN_RIGHT);
		}

		return result;
	}

	/**
	 * Recursively walks in a given direction and checks whether or not similar pieces are connected.
	 * @param {Number} targetPiece The type of piece the current and future pieces should connect to.
	 * @param {Number} direction The direction the pieces should connect in.
	 * @param {Number} x The x position of the current piece.
	 * @param {Number} y The y position of the current piece.
	 * @returns How far the connection between similar pieces extends.
	 */
	walk(targetPiece, direction, x, y) {
		// Make sure the x, y positions are valid (end condition).
		if (x < 0 || x > this.columns || y < 0 || this.y > this.rows) {
			return 0;
		}

		// Make sure the current piece is valid.
		if (this.get(x, y) !== targetPiece) {
			return 0;
		}

		// Recursively continue checking consecutive pieces in the appropriate direction.
		return (
			1 + this.walk(targetPiece, direction, x + direction.x, y + direction.y)
		);
	}

	/**
	 * Returns whether or not a given player satisfies the board's win condition.
	 * @param {Number} targetPiece The respective piece of the current player to test.
	 */
	winCondition(targetPiece) {
		// Iterate through every element of the board.
		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.columns; x++) {
				// Only test for a win condition if the current piece is of the same type as the target piece.
				if (this.get(x, y) !== targetPiece) {
					continue;
				}

				// For the current piece, check all of its adjacent pieces, and return the direction of any similar pieces.
				const directions = this.getAdjacentDirections(x, y);

				// Iterate through each direction and check if the pieces form a long enough connection to win.
				for (let direction of directions) {
					if (this.walk(targetPiece, direction, x, y) >= this.target) {
						return true;
					}
				}
			}
		}

		return false;
	}

	/**
	 * Simulates dropping a piece at a given x position on the board.
	 * @param {Number} x The column the piece will be placed at.
	 * @returns Whether or not the move itself was valid.
	 */
	dropPieceAt(x) {
		// Make sure the given x position is valid.
		if (x < 0 || x > this.columns || this.get(x, 0) !== 0) {
			return false;
		}

		const player = this.turns % 2 === 0 ? 1 : 2;

		// Simulate the piece falling from the top of the board.
		for (let y = 0; y < this.rows; y++) {
			// Stop the piece from falling if it hits the bottom of the board or if there is a piece below it.
			if (y + 1 >= this.rows || this.get(x, y + 1) !== 0) {
				this.set(x, y, player);
				this.turns++;
				return true;
			}
		}

		return false;
	}
}

module.exports = Board;
