require("dotenv").config();
const Obelus = require("./src/obelus/index.js");

const refactor = new Obelus.Qualifier("$refactor").addCommand(
	new Obelus.Command("hello", (message) => {
		message.reply("how are you?");
	}),
	new Obelus.Command("repeat|copy", (message) => {
		const args = message.content.split(/\s/);
		let word = "";

		for (let i = 2; i < args.length; i++) {
			word += `${args[i]} `;
		}

		message.reply(`${word}`);
	}),
	new Obelus.Command("true or false|true or false,|torf", (message) => {
		if (Math.floor(Math.random() * 100) % 2 === 0) {
			message.reply("true.");
		} else {
			message.reply("false");
		}
	}),
	new Obelus.Command(/\sor\s/, (message, args) => {
		const options = args.split(/\sor\s/);

		let result = options[Math.floor(Math.random() * options.length)];

		if (/\w+\?/g.test(result)) {
			result = result.substring(0, result.length - 1);
		}

		message.reply(result);
	})
);

const play = new Obelus.Qualifier("!play").addCommand(
	new Obelus.Command("numberguess", (message) => {
		message.reply("starting a new game of Number Guess.");
	}),
	new Obelus.Command("connectfour", (message) => {
		message.reply("starting a new game of Connect Four.");
	})
);

new Obelus.Bot(process.env.BOT_TOKEN).addQualifier(refactor, play).run();
