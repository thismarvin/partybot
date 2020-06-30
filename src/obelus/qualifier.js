class Qualifier {
	constructor(prefix) {
		this.prefix = prefix;
		this.commands = [];
	}

	addCommand(...command) {
		for (let c of command) {
			this.commands.push(c);
		}

		return this;
	}

	update(message) {
		const args = message.content.split(/\s+/g);

		if (args[0] !== this.prefix) {
			return;
		}

		for (let command of this.commands) {
			command.update(message, args.slice(1));
		}
	}
}

module.exports = Qualifier;
