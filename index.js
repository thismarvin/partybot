require("dotenv").config();

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
			message.channel.send("Starting a new game of Connect Four!");
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

		default:
			message.reply("Sorry but that is not a valid command!");
	}
});

client.login(process.env.BOT_TOKEN);
