class Qualifier {
	constructor(prefix) {
		this.prefix = prefix.toLowerCase();
		this.commands = [];
	}

	addCommand(...command) {
		for (let c of command) {
			this.commands.push(c);
		}

		return this;
	}

	update(message) {
		const prefix = message.content.toLowerCase().trim().split(/\s/)[0];

		if (this.prefix !== prefix) {
			return;
		}

		const args = message.content
			.toLowerCase()
			.trim()
			.substring(this.prefix.length + 1);

		for (let command of this.commands) {
			command.update(message, args);
		}
	}
}

module.exports = Qualifier;
