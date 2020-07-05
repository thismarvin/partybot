class Program {
	constructor(prefix) {
		this.prefix = prefix;
		this.commands = [];
		this.onMessage = null;
	}

	addCommand(...command) {
		for (let c of command) {
			this.commands.push(c);
		}

		return this;
	}

	setOnMessage(lambda) {
		this.onMessage = lambda;
		
		return this;
	}

	update(message) {
		if (this.onMessage !== null && typeof this.onMessage === "function") {
			this.onMessage(message);
		}

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
