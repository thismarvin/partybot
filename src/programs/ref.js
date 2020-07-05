const Obelus = require("../lib/obelus/index.js");

const ref = new Obelus.Program("$ref").addCommand(
	new Obelus.Command("hello|hi|hey", (message) => {
		switch (Math.floor(Math.random() * 5)) {
			case 0:
				message.reply("hi!");
				break;
			case 1:
				message.reply("how are you?");
				break;
			case 2:
				message.reply("greetings.");
				break;
			case 3:
				message.reply("what's up?");
				break;
			case 4:
				message.reply("hey there!");
				break;
		}
	}),
	new Obelus.Command("repeat|copy", (message) => {
		const args = message.content.split(/\brepeat\b|\bcopy\b/);
		let word = "";

		for (let i = 1; i < args.length; i++) {
			word += `${args[i].trim()}`;
		}

		message.channel.send(word);
	}),
	new Obelus.Command(/\btrue or false\b,*|\btorf\b/, (message) => {
		if (Math.floor(Math.random() * 100) % 2 === 0) {
			message.reply("true.");
		} else {
			message.reply("false");
		}
	}),
	new Obelus.Command(/(?<!true )\bor\b/, (message, args) => {
		const options = args.split(/\sor\s/);

		let result = options[Math.floor(Math.random() * options.length)];

		if (/\w+\?/g.test(result)) {
			result = result.substring(0, result.length - 1);
		}

		message.reply(result);
	}),
	new Obelus.Command("clap", (message, args) => {
		const parts = args.split(/\s/);

		let word = "";

		for (let i = 1; i < parts.length; i++) {
			word += `${parts[i]}👏`;
		}

		message.channel.send(word);
	})
);

module.exports = ref;
