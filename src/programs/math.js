const Obelus = require("../lib/obelus/index.js");

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

const math = new Obelus.Program("$math").addCommand(
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

module.exports = math;