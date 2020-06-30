const Discord = require("discord.js");

class Bot {
	constructor(token, qualifier) {
		this.token = token;
		this.qualifier = qualifier.toLowerCase();
		this.client = new Discord.Client(this.token);
		this.commands = [];

		this.client.on("ready", () => {
			console.log(`Logged in as ${this.client.user.tag}!`);
		});

		this.client.on("message", (message) => {
			const args = message.content.toLowerCase().split(/\s+/g);

			if (args[0] !== this.qualifier) {
				return;
			}

			for (let command of this.commands) {
				command.update(message, args.slice(1));
			}
		});
	}

	addCommand(command) {
		this.commands.push(command);

		return this;
	}

	run() {
		this.client.login(this.token);

		return this;
	}
}

module.exports = Bot;