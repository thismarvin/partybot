const Discord = require("discord.js");
const fs = require("fs");
const Obelus = require("../lib/obelus/index.js");
const { CanvasHelper, Game } = require("../lib/connect-four/index.js");

const gameMap = new Map();
const gameInfoMap = new Map();

const connectFour = new Obelus.Program("!challenge")
	.addCommand(
		new Obelus.Command(
			/<@!\d+>\s+to\s+(connectfour|connect\s+four|connect4|connect\s+4|c4)\b/i,
			async (message) => {
				const guildId = parseInt(message.guild.id);

				const challenger = message.author;
				const opponent = message.mentions.users.first();

				const challengerId = parseInt(challenger.id);
				const opponentId = parseInt(opponent.id);

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
					player = challenger;
				} else if (guildInfo.has(opponentId)) {
					player = opponent;
				}

				if (player !== null) {
					message.reply(
						`${player.username} is already in a game; cannot start a new game.`
					);
					return;
				}

				// Send a message to the opponent that confirms their participation.
				const confirmationMessage = await message.channel.send(
					`${opponent}, react to this message to accept the challenge.`
				);

				// Wait ten seconds to see whether or not the opponent reacted to the message.
				const reactions = await confirmationMessage.awaitReactions(
					(_, user) => user.id === opponent.id,
					{
						time: 10000,
					}
				);

				// Do no setup the game if the opponent never responded.
				if (reactions.size === 0) {
					message.reply(
						`sorry but it looks like ${opponent.username} doesn't want to play.`
					);
					return;
				}

				// Check if the user was cheeky and tried to queue two games at once.
				if (guildInfo.has(challengerId) || guildInfo.has(opponentId)) {
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

		// Check if the current user won the game.
		if (game.winCondition) {
			const winner = game.turns % 2 === 0 ? game.opponent : game.challenger;

			await message.channel.send(`${winner}, congrats! You won!`);

			// Clean up the current game.
			gameMap.delete(gameId);
			guildInfo.delete(parseInt(game.challenger.id));
			guildInfo.delete(parseInt(game.opponent.id));

			return;
		}

		if (game.tied) {
			await message.channel.send(
				`${game.challenger} ${game.opponent}, looks like it's a tie!`
			);

			// Clean up the current game.
			gameMap.delete(gameId);
			guildInfo.delete(parseInt(game.challenger.id));
			guildInfo.delete(parseInt(game.opponent.id));

			return;
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

module.exports = connectFour;
