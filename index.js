require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (message) => {
	const formattedMessage = message.content.toLowerCase().trim().split(" ");

  console.log(formattedMessage);

	if (formattedMessage[0] !== "!play") {
		return;
	}
});

client.login(process.env.BOT_TOKEN);
