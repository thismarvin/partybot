const Discord = require("discord.js");

class Bot {
	constructor(token) {
		this.token = token;
		this.client = new Discord.Client();
		this.programs = [];

		this.client.on("ready", () => {
			console.log(`Logged in as ${this.client.user.tag}!`);
		});

		this.client.on("message", (message) => {
			for (let program of this.programs) {
				program.update(message);
			}
		});
	}

	addProgram(...program) {
		for (let p of program) {
			this.programs.push(p);
		}

		return this;
	}

	run() {
		this.client.login(this.token);

		return this;
	}
}

module.exports = Bot;
