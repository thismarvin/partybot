require("dotenv").config();
const Obelus = require("./src/obelus/index.js");

function evaluate(a, b, operator) {
	switch (operator) {
		case "+":
			return a + b;

		case "-":
			return a - b;

		case "*":
			return a * b;

		case "/":
			return a / b;

		default:
			throw new TypeError("The given operator is not valid.");
	}
}

function prefix(args) {
	const operator = /[+\-*/]/;
	const number = /^-?[\d]+(.\d*)?$/;
	const stack = [];

	for (let i = args.length - 1; i >= 0; i--) {
		stack.push(args[i]);

		if (
			stack.length >= 3 &&
			operator.test(stack[stack.length - 1]) &&
			number.test(stack[stack.length - 1 - 1]) &&
			number.test(stack[stack.length - 1 - 2])
		) {
			const operator = stack.pop();
			const a = parseFloat(stack.pop());
			const b = parseFloat(stack.pop());

			try {
				const result = evaluate(a, b, operator);
				if (isNaN(result)) {
					return "ERR_NOT_A_NUMBER";
				}

				stack.push(result);
			} catch (error) {
				return "ERR_INVALID_OPERATOR";
			}
		}
	}

	if (stack.length !== 1) {
		return "ERR_INVALID_SYNTAX";
	}

	return stack.pop();
}

function postfix(args) {
	const operator = /[+\-*/]/;
	const number = /^-?[\d]+(.\d*)?$/;
	const stack = [];

	for (let i = 0; i < args.length; i++) {
		stack.push(args[i]);

		if (
			stack.length >= 3 &&
			operator.test(stack[stack.length - 1]) &&
			number.test(stack[stack.length - 1 - 1]) &&
			number.test(stack[stack.length - 1 - 2])
		) {
			const operator = stack.pop();
			const b = parseFloat(stack.pop());
			const a = parseFloat(stack.pop());

			try {
				const result = evaluate(a, b, operator);
				if (isNaN(result)) {
					return "ERR_NOT_A_NUMBER";
				}

				stack.push(result);
			} catch (error) {
				return "ERR_INVALID_OPERATOR";
			}
		}
	}

	if (stack.length !== 1) {
		return "ERR_INVALID_SYNTAX";
	}

	return stack.pop();
}

const ref = new Obelus.Qualifier("$ref").addCommand(
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

		message.reply(word);
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

const challenge = new Obelus.Qualifier("!challenge").addCommand(
	new Obelus.Command("number guess|numberguess|ng", (message) => {
		message.reply("starting a new game of Number Guess.");
	}),
	new Obelus.Command("connect four|connectfour|connect4|c4", (message) => {
		message.reply("starting a new game of Connect Four.");
	})
);

const math = new Obelus.Qualifier("$math").addCommand(
	new Obelus.Command("pre|prefix", (message, args) => {
		const formatted = args.split(/\s/);
		formatted.shift();

		message.reply(`${prefix(formatted)}`);
	}),
	new Obelus.Command("post|postfix", (message, args) => {
		const formatted = args.split(/\s/);
		formatted.shift();

		message.reply(`${postfix(formatted)}`);
	}),
	new Obelus.Command("avg|average", (message, args) => {
		const formatted = args.split(/\s/);
		formatted.shift();

		const average =
			formatted.reduce((prev, current) => prev + parseFloat(current), 0) /
			formatted.length;

		if (isNaN(average)) {
			message.reply("ERR_INVALID_ARGS");
		} else {
			message.reply(average);
		}
	})
);

new Obelus.Bot(process.env.BOT_TOKEN).addQualifier(ref, challenge, math).run();
