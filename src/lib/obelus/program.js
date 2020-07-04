class Program {
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
		if (
			message.content === this.prefix ||
			message.content.substring(0, this.prefix.length + 1) !== `${this.prefix} `
		) {
			return;
		}

		const args = message.content.substring(this.prefix.length).trim();

		for (let command of this.commands) {
			if (command.parse(message, args)) {
				return;
			}
		}
	}
}

module.exports = Program;
