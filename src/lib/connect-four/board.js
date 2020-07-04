const { createCanvas } = require("canvas");

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

const DISCORD_GRAY = "#37393F";
const PALETTES = {
	ENOS16: {
		board: "#58AEEE",
		one: "#F9D381",
		two: "#E75952",
	},
	PICO8: {
		board: "#29adff",
		one: "#ffec27",
		two: "#ff004d",
	},
	WEB: {
		board: "#3399ff",
		one: "#ffcc33",
		two: "#ff3333",
	},
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

	/**
	 * Creates and returns a canvas that represents the current board's state.
	 * @param {Object} options Optional options to apply to the canvas.
	 */
	createCanvas(options) {
		let padding = 4;
		let tileSize = 20;
		let fontSize = Math.floor(tileSize * 0.8);
		let boardColor = PALETTES.WEB.board;
		let oneColor = PALETTES.WEB.one;
		let twoColor = PALETTES.WEB.two;

		if (options !== undefined) {
			if (options.padding !== undefined) {
				padding = parseInt(options.padding);
			}

			if (options.tileSize !== undefined) {
				tileSize = parseInt(options.tileSize);
				fontSize = Math.floor(tileSize * 0.8);
			}

			if (options.palette) {
				if (options.palette.board !== undefined) {
					boardColor = options.palette.board;
				}
				if (options.palette.one !== undefined) {
					oneColor = options.palette.one;
				}
				if (options.palette.two !== undefined) {
					twoColor = options.palette.two;
				}
			}
		}

		const canvas = createCanvas(
			this.columns * tileSize + padding * 2,
			this.rows * tileSize + padding * 3 + fontSize
		);
		const ctx = canvas.getContext("2d");

		// Clear Canvas.
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Draw board.
		ctx.fillStyle = boardColor;
		ctx.fillRect(
			0,
			padding + fontSize,
			canvas.width,
			canvas.height - (padding + fontSize)
		);

		// Draw text.
		ctx.font = `bold ${fontSize}px monospace`;
		ctx.textBaseline = "top";
		ctx.textAlign = "left";

		for (let i = 0; i < this.columns; i++) {
			ctx.fillStyle = "#FFFFFF";
			ctx.fillText(
				(i + 1).toString(),
				padding + i * tileSize + tileSize * 0.32,
				padding - tileSize * 0.1
			);
		}

		// Draw pieces.
		let y = 0;
		for (let i = 0; i < this.state.length; i++) {
			const x = i % this.columns;

			switch (this.state[i]) {
				case 0:
					ctx.fillStyle = DISCORD_GRAY;
					break;
				case 1:
					ctx.fillStyle = oneColor;
					break;
				case 2:
					ctx.fillStyle = twoColor;
					break;
			}

			ctx.beginPath();
			ctx.arc(
				padding + x * tileSize + tileSize * 0.5,
				padding + fontSize + padding + y * tileSize + tileSize * 0.5,
				(tileSize - padding) * 0.5,
				0,
				2 * Math.PI
			);
			ctx.fill();

			if (x === this.columns - 1) {
				y++;
			}
		}

		return canvas;
	}
}

module.exports = Board;
