const PseudoRegex = require("./pseudoRegex.js");

class Command {
	constructor(args, onMatch) {
		this.onMatch = onMatch;
		this.regex = null;
		this.aliases = [];

		if (args instanceof RegExp) {
			this.regex = args;
		} else {
			this.regex = new PseudoRegex(args);
		}
	}

	parse(message, args) {
		if (!this.regex.test(args)) {
			return false;
		}

		this.onMatch(message, args);

		return true;
	}
}

module.exports = Command;
