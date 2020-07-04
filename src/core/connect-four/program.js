const Obelus = require("../../lib/obelus/index.js");
const Game = require("./game.js");

const gameMap = new Map();
const gameInfoMap = new Map();

const program = new Obelus.Program("!challenge").addCommand(
	new Obelus.Command(
		/<@!\d+>\s+to\s+(connectfour|connect\s+four|connect4|c4)\b/,
		(message, args) => {
			const guildId = parseInt(message.guild.id);
			const challengerId = parseInt(message.author.id);
			const opponentId = parseInt(args.substring(3, args.indexOf(">")));

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
				player = message.author.username;
			} else if (guildInfo.has(opponentId)) {
				player = message.mentions.users.first();
			}

			if (player !== null) {
				message.reply(
					`${player} is already in a game; cannot start a new game.`
				);
				return;
			}

			// We passed all the preconditions, so setup the game.
			gameMap.set(gameId, new Game(challengerId, opponentId));

			guildInfo.set(opponentId, gameId);
			guildInfo.set(challengerId, gameId);

			message.reply("Starting a new game of connect four!");
		}
	)
);

module.exports = program;
