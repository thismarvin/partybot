const { createCanvas } = require("canvas");

const discordGray = "#37393F";
const palettes = {
	enos16: {
		blue: "#58AEEE",
		yellow: "#F9D381",
		red: "#E75952",
	},
	pico8: {
		blue: "#29adff",
		yellow: "#ffec27",
		red: "#ff004d",
	},
	web: {
		blue: "#3399ff",
		yellow: "#ffcc33",
		red: "#ff3333",
	},
};

const padding = 4;
const boardWidth = 7;
const boardHeight = 6;
const tileSize = 20;
const palette = palettes.web;

const fontSize = Math.floor(tileSize * 0.8);

const canvas = createCanvas(
	boardWidth * tileSize + padding * 2,
	boardHeight * tileSize + padding * 3 + fontSize
);
const ctx = canvas.getContext("2d");

function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function newGame() {
	return new Array(boardWidth * boardHeight).fill(0);
}

function placeAt(board, x, turn) {
	const result = board.splice(0);
	const player = turn % 2 === 0 ? 1 : 2;

	const get = (x, y) => {
		return result[boardWidth * y + x];
	};
	const set = (x, y, value) => {
		result[boardWidth * y + x] = value;
	};

	for (let y = 0; y < boardHeight; y++) {
		if (y === boardHeight - 1 || get(x - 1, y + 1) !== 0) {
			set(x - 1, y, player);
			break;
		}
	}

	return result;
}

function getBoard(state) {
	clearCanvas();

	ctx.fillStyle = palette.blue;
	ctx.fillRect(0, padding + fontSize, canvas.width, canvas.height);

	ctx.font = `bold ${fontSize}px monospace`;
	ctx.textBaseline = "top";
	ctx.textAlign = "left";

	for (let i = 0; i < boardWidth; i++) {
		ctx.fillStyle = "#FFFFF;";
		ctx.fillText(
			(i + 1).toString(),
			padding + i * tileSize + tileSize * 0.32,
			padding - tileSize * 0.1
		);
	}

	let y = 0;
	for (let i = 0; i < state.length; i++) {
		const x = i % boardWidth;

		switch (state[i]) {
			case 0:
				ctx.fillStyle = discordGray;
				break;
			case 1:
				ctx.fillStyle = palette.yellow;
				break;
			case 2:
				ctx.fillStyle = palette.red;
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

		if (x === boardWidth - 1) {
			y++;
		}
	}

	return canvas;
}

module.exports = {
	newGame,
	placeAt,
	getBoard,
};
