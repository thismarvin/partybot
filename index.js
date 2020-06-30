require("dotenv").config();
const fs = require("fs");

const C4 = require("./src/connectFour.js");

const Discord = require("discord.js");
const client = new Discord.Client();

let games = [];

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (message) => {
	const formattedMessage = message.content.toLowerCase().trim().split(" ");
	const currentUser = message.author.username;

	for (let i = 0; i < games.length; i++) {
		if (!games[i].players.has(currentUser)) {
			continue;
		}

		switch (games[i].type) {
			case "numberguess":
				games[i].turns++;

				const guess = parseInt(message.content);

				if (guess < games[i].number) {
					message.reply("too low!");
				}

				if (guess > games[i].number) {
					message.reply("too high!");
				}

				if (guess === games[i].number) {
					message.reply(`you win! It took you ${games[i].turns} tries to win.`);
					games.splice(i, 1);
				}
				return;

			case "connectfour":
				const x = parseInt(message.content);

				if (!Number.isInteger(x)) {
					return;
				}

				if (games[i].challenger !== games[i].opponent) {
					if (games[i].turns % 2 === 0 && currentUser === games[i].challenger) {
						return;
					} else if (
						games[i].turns % 2 !== 0 &&
						currentUser === games[i].opponent
					) {
						return;
					}
				}

				if (!games[i].board.dropAt(x - 1)) {
					message.reply("that is not a valid move!");
					return;
				}

				await sendBoard(
					message,
					games[i].challenger,
					games[i].opponent,
					games[i].board
				);

				if (games[i].board.winCondition(games[i].turns % 2 === 0 ? 1 : 2)) {
					await message.reply("you won! Congrats! 🎉");
					games.splice(i, 1);
				} else {
					games[i].turns++;
				}

				return;
		}
	}

	if (formattedMessage[0] !== "!play") {
		return;
	}

	switch (formattedMessage[1]) {
		case "games":
			message.reply(
				"here is a list of all the games I can help you play: NumberGuess and ConnectFour."
			);
			break;

		case "connectfour":
			if (formattedMessage[2] !== "vs") {
				message.reply("sorry but that is not a valid command!");
				break;
			}

			if (message.mentions.users.size === 0) {
				message.reply("make sure to mention someone to challenge them.");
				return;
			}

			let opponent = "";
			for (let entry of message.mentions.users.entries()) {
				opponent = entry[1].username;
				break;
			}

			const board = new C4.Board(6, 7);

			await sendBoard(message, currentUser, opponent, board);

			games.push({
				type: "connectfour",
				challenger: currentUser,
				opponent: opponent,
				players: new Set([currentUser, opponent]),
				board: board,
				turns: 0,
			});
			break;

		case "numberguess":
			message.channel.send("Starting a new game of Number Guess!");
			message.reply(
				"I chose a number between 1 and 100. See if you can guess what number it is."
			);

			games.push({
				type: "numberguess",
				players: new Set([currentUser]),
				number: Math.floor(Math.random() * 100 + 1),
				turns: 0,
			});
			break;

		default:
			message.reply("sorry but that is not a valid command!");
	}
});

async function sendBoard(message, currentUser, opponent, board) {
	const fileName = `c4_${currentUser}_vs_${opponent}.png`;
	const canvas = C4.createCanvasFromBoard(board);

	await C4.saveCanvasAsPNG(canvas, __dirname, fileName);

	const attachment = new Discord.MessageAttachment(
		`./${fileName}`,
		"board.png"
	);

	const embed = new Discord.MessageEmbed()
		.setTitle(`${currentUser} vs ${opponent}`)
		.setDescription(
			`Your move ${board.turns % 2 == 0 ? opponent : currentUser}`
		)
		.attachFiles(attachment)
		.setImage("attachment://board.png");

	await message.channel.send(embed);

	fs.unlinkSync(`${__dirname}/${fileName}`, () => {});
}

client.login(process.env.BOT_TOKEN);
