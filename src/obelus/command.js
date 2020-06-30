class Command {
	constructor(args, onMatch) {
		this.args = args.split(/\s+/g);
		this.onMatch = onMatch;
	}

	update(message, args) {
		for (let i = 0; i < this.args.length; i++) {
			if (this.args[i] !== args[i]) {
				return;
			}
		}

		this.onMatch(message, args);
	}
}

module.exports = Command;
