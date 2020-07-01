class Command {
	constructor(args, onMatch) {
		this.onMatch = onMatch;
		this.regex = null;
		this.aliases = [];

		if (args instanceof RegExp) {
			this.regex = args;
		} else {
			const formattedArgs = args.toLowerCase().trim();

			if (formattedArgs.indexOf("|") >= 0) {
				const aliases = formattedArgs.split("|");

				for (let alias of aliases) {
					this.aliases.push(alias.trim());
				}
			} else {
				this.aliases.push(formattedArgs);
			}
		}
	}

	update(message, args) {
		if (this.regex !== null) {
			if (!this.regex.test(args)) {
				return;
			}
		} else {
			let valid = false;

			for (let alias of this.aliases) {
				if (args.substring(0, alias.length) === alias) {
					valid = true;
					break;
				}
			}

			if (!valid) {
				return;
			}
		}

		this.onMatch(message, args);
	}
}

module.exports = Command;
