class Command {
	constructor(args, onMatch) {
		this.args = args.toLowerCase().split(/\s+/g);
    this.onMatch = onMatch;
	}

	update(message, args) {
		if (args.length !== this.args.length) {
			return;
		}

		for (let i = 0; i < args.length; i++) {
			if (args[i] !== this.args[i]) {
				return;
			}
		}

		this.onMatch(message, args);
	}
}

module.exports = Command;
