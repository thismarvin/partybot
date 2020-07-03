const Board = require("./board.js");
const fs = require("fs");
const { createCanvas } = require("canvas");

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

function createCanvasFromBoard(board, options) {
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
		board.columns * tileSize + padding * 2,
		board.rows * tileSize + padding * 3 + fontSize
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

	for (let i = 0; i < board.columns; i++) {
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText(
			(i + 1).toString(),
			padding + i * tileSize + tileSize * 0.32,
			padding - tileSize * 0.1
		);
	}

	// Draw pieces.
	let y = 0;
	for (let i = 0; i < board.state.length; i++) {
		const x = i % board.columns;

		switch (board.state[i]) {
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

		if (x === board.columns - 1) {
			y++;
		}
	}

	return canvas;
}

function saveCanvasAsPNG(canvas, path, fileName) {
	return new Promise((resolve, reject) => {
		const out = fs.createWriteStream(`${path}/${fileName}`);
		const stream = canvas.createPNGStream();

		stream.pipe(out);
		out.on("finish", (error) => {
			if (error !== undefined) {
				reject(error);
				return;
			}

			resolve();
		});
	});
}

module.exports = {
	Board,
	createCanvasFromBoard,
	saveCanvasAsPNG,
};
