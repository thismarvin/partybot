const Discord = require("discord.js");
const fs = require("fs");
const Obelus = require("../../lib/obelus/index.js");
const Game = require("./game.js");
const { CanvasHelper } = require("../../lib/connect-four/index.js");

const gameMap = new Map();
const gameInfoMap = new Map();

const program = new Obelus.Program("!challenge")
	.addCommand(
		new Obelus.Command(
			/<@!\d+>\s+to\s+(connectfour|connect\s+four|connect4|c4)\b/i,
			async (message, args) => {
				const guildId = parseInt(message.guild.id);
				const challengerId = parseInt(message.author.id);
				const opponentId = parseInt(args.substring(3, args.indexOf(">")));

				const challengerName = message.author.username;
				const opponentName = message.mentions.users.first().username;

				// Create a unique game id.
				let gameId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
				while (gameMap.has(gameId)) {
					gameId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
				}

				// Make sure the info map contains the current guild.
				if (!gameInfoMap.has(guildId)) {
					gameInfoMap.set(guildId, new Map());
				}

				const guildInfo = gameInfoMap.get(guildId);

				// Make sure that neither the challenger nor the opponent are already in a game.
				let player = null;
				if (guildInfo.has(challengerId)) {
					player = challengerName;
				} else if (guildInfo.has(opponentId)) {
					player = opponentName;
				}

				if (player !== null) {
					message.reply(
						`${player} is already in a game; cannot start a new game.`
					);
					return;
				}

				// We passed all the preconditions, so setup the game.
				gameMap.set(
					gameId,
					new Game(message.author, message.mentions.users.first())
				);

				guildInfo.set(opponentId, gameId);
				guildInfo.set(challengerId, gameId);

				message.reply("Starting a new game of connect four!");

				await sendBoard(message, gameMap.get(gameId), gameId);
			}
		)
	)
	.setOnMessage(async (message) => {
		const args = message.content.split(/\s+/);

		// Make sure the first argument is a number.
		if (!/\d+/.test(args[0])) {
			return;
		}

		const guildId = parseInt(message.guild.id);

		// Make sure the current guild has been registered.
		if (!gameInfoMap.has(guildId)) {
			return;
		}

		const guildInfo = gameInfoMap.get(guildId);
		const authorId = parseInt(message.author.id);

		// Make sure the current guild has game info for the current user.
		if (!guildInfo.has(authorId)) {
			return;
		}

		const gameId = guildInfo.get(authorId);
		const game = gameMap.get(gameId);

		// Make sure it is the current user's turn.
		const expectedId =
			game.turns % 2 === 0
				? parseInt(game.opponent.id)
				: parseInt(game.challenger.id);

		if (authorId !== expectedId) {
			return;
		}

		// Have the game process the given move, and make sure the move was valid.
		if (!game.process(args[0])) {
			message.reply("that is not a valid move!");
			return;
		}

		// Send the game's current state back to the user.
		await sendBoard(message, game, gameId);

		// Check if the current use won the game.
		if (game.winCondition) {
			const winner = game.turns % 2 === 0 ? game.opponent : game.challenger;

			await message.channel.send(`${winner}, congrats! You won!`);

			// Clean up the current game.
			gameMap.delete(gameId);
			guildInfo.delete(parseInt(game.challenger.id));
			guildInfo.delete(parseInt(game.opponent.id));
		}
	});

async function sendBoard(message, game, gameId) {
	const canvas = game.canvas;
	const fileName = `c4_${gameId}.png`;

	await CanvasHelper.saveAsPNG(canvas, __dirname, fileName);

	const attachment = new Discord.MessageAttachment(
		`${__dirname}/${fileName}`,
		"board.png"
	);

	const embed = new Discord.MessageEmbed()
		.setTitle(`${game.challenger.username} vs ${game.opponent.username}`)
		.setDescription(
			`Your move **${
				game.turns % 2 == 0 ? game.opponent.username : game.challenger.username
			}**`
		)
		.attachFiles(attachment)
		.setImage("attachment://board.png");

	await message.channel.send(embed);

	fs.unlinkSync(`${__dirname}/${fileName}`, () => {});
}

module.exports = program;
