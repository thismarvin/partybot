class Command {
	constructor(args, onMatch) {
		this.aliases = [];

		const formattedArgs = args.toLowerCase().trim();

		if (formattedArgs.indexOf("|") >= 0) {
			const aliases = formattedArgs.split("|");

			for (let alias of aliases) {
				this.aliases.push(alias.trim());
			}
		} else {
			this.aliases.push(formattedArgs);
		}

		this.onMatch = onMatch;
	}

	update(message, args) {
		let aliasIndex = -1;

		for (let i = 0; i < this.aliases.length; i++) {
			if (args.substring(0, this.aliases[i].length) === this.aliases[i]) {
				aliasIndex = i;
				break;
			}
		}

		if (aliasIndex === -1) {
			return;
		}

		this.onMatch(message, args.substring(this.aliases[aliasIndex].length + 1));
	}
}

module.exports = Command;
