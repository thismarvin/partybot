class Qualifier {
	constructor(prefix) {
		this.prefix = prefix;
		this.commands = [];
	}

	addCommand(command) {
		this.commands.push(command);

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
