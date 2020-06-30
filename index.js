require("dotenv").config();
const Obelus = require("./src/obelus/index.js");

const refactor = new Obelus.Qualifier("$refactor")
	.addCommand(
		new Obelus.Command("hello", (message) => {
			message.reply("how are you?");
		})
	)
	.addCommand(
		new Obelus.Command("true or false", (message) => {
			if (Math.floor(Math.random() * 100) % 2 === 0) {
				message.reply("true.");
			} else {
				message.reply("false");
			}
		})
	)
	.addCommand(
		new Obelus.Command("repeat", (message, args) => {
			let word = "";

			for (let i = 1; i < args.length; i++) {
				word += `${args[i]} `;
			}
			message.reply(`${word.trim()}`);
		})
	);

const play = new Obelus.Qualifier("!play")
	.addCommand(
		new Obelus.Command("numberguess", (message) => {
			message.reply("starting a new game of Number Guess.");
		})
	)
	.addCommand(
		new Obelus.Command("connectfour", (message) => {
			message.reply("starting a new game of Connect Four.");
		})
	);

new Obelus.Bot(process.env.BOT_TOKEN)
	.addQualifier(refactor)
	.addQualifier(play)
	.run();
