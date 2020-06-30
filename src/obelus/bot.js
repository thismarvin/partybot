const Discord = require("discord.js");

class Bot {
	constructor(token) {
		this.token = token;
		this.client = new Discord.Client();
		this.qualifiers = [];

		this.client.on("ready", () => {
			console.log(`Logged in as ${this.client.user.tag}!`);
		});

		this.client.on("message", (message) => {
			for (let qualifier of this.qualifiers) {
				qualifier.update(message);
			}
		});
	}

	addQualifier(qualifier) {
		this.qualifiers.push(qualifier);

		return this;
	}

	run() {
		this.client.login(this.token);

		return this;
	}
}

module.exports = Bot;
