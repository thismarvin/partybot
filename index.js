require("dotenv").config();
const fs = require("fs");

const C4 = require("./src/connectFour.js");

const Discord = require("discord.js");
const client = new Discord.Client();

let games = [];

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (message) => {
	const formattedMessage = message.content.toLowerCase().trim().split(" ");
	const player = message.author.username;

	for (let i = 0; i < games.length; i++) {
		if (!games[i].players.has(player)) {
			continue;
		}

		switch (games[i].type) {
			case "numberguess":
				games[i].turns++;

				const guess = parseInt(message.content);

				if (guess < games[i].number) {
					message.reply("Too low!");
				}

				if (guess > games[i].number) {
					message.reply("Too high!");
				}

				if (guess === games[i].number) {
					message.reply(`You win! It took you ${games[i].turns} tries to win.`);
					games.splice(i, 1);
				}
				return;

			case "connectfour":		
        const x = parseInt(message.content);

        if (!Number.isInteger(x)) {
					return;
				}

				const newState = C4.placeAt(games[i].board, x, games[i].turns);
				console.log(newState);
				games[i].turns++;

				const board = C4.getBoard(newState);
				games[i].board = newState;

				const out = fs.createWriteStream(__dirname + "/test.png");
				const stream = board.createPNGStream();
				stream.pipe(out);

				out.on("finish", async () => {
					await message.channel.send(
						new Discord.MessageAttachment("./test.png")
					);
					fs.unlink(__dirname + "/test.png", () => {});
				});

				return;
		}
	}

	if (formattedMessage[0] !== "!play") {
		return;
	}

	switch (formattedMessage[1]) {
		case "games":
			message.reply(
				"here is a list of all the games I can help you play: NumberGuess, ConnectFour"
			);
			break;

		case "connectfour":
			if (formattedMessage[2] !== "vs") {
				message.channel.send("Error");
				break;
			}

			message.channel.send("Starting a new game of Connect Four!");

			const state = C4.newGame();
			const board = C4.getBoard(state);

			const out = fs.createWriteStream(__dirname + "/test.png");
			const stream = board.createPNGStream();
			stream.pipe(out);

			out.on("finish", async () => {
				await message.channel.send(new Discord.MessageAttachment("./test.png"));
				fs.unlink(__dirname + "/test.png", () => {});
			});

			games.push({
				type: "connectfour",
				players: new Set([player, message.author.username]),
				board: state,
				turns: 0,
			});
			break;

		case "numberguess":
			message.channel.send("Starting a new game of Number Guess!");
			message.channel.send(
				"I chose a number between 1 and 100. See if you can guess what number it is."
			);

			games.push({
				type: "numberguess",
				players: new Set([player]),
				number: Math.floor(Math.random() * 100 + 1),
				turns: 0,
			});
			break;

		// case "test":
		// 	const board = getBoard([
		// 		0,
		// 		0,
		// 		0,
		// 		0,
		// 		0,
		// 		0,
		// 		0,
		// 		0,
		// 		0,
		// 		0,
		// 		1,
		// 		0,
		// 		0,
		// 		0,
		// 		0,
		// 		0,
		// 		2,
		// 		2,
		// 		0,
		// 		0,
		// 		0,
		// 		0,
		// 		0,
		// 		1,
		// 		1,
		// 		0,
		// 		0,
		// 		0,
		// 		0,
		// 		0,
		// 		1,
		// 		2,
		// 		0,
		// 		0,
		// 		0,
		// 		0,
		// 		1,
		// 		2,
		// 		1,
		// 		2,
		// 		0,
		// 		0,
		// 	]);

		// 	const out = fs.createWriteStream(__dirname + "/test.png");
		// 	const stream = board.createPNGStream();
		// 	stream.pipe(out);

		// 	out.on("finish", async () => {
		// 		await message.channel.send(new Discord.MessageAttachment("./test.png"));
		// 		fs.unlink(__dirname + "/test.png", () => {});
		// 	});
		// 	break;

		default:
			message.reply("Sorry but that is not a valid command!");
	}
});

client.login(process.env.BOT_TOKEN);

// const board = drawBoard([
//   0,0,0,0,0,0,0,
//   0,0,0,0,0,0,0,
//   0,0,0,0,0,0,0,
//   0,0,0,0,0,0,0,
//   0,0,0,0,0,0,0,
//   0,0,0,0,0,0,0,
// ]);
