require("dotenv").config();

const Obelus = require("./lib/obelus/index.js");

const connectFour = require("./programs/connectFour.js");
const math = require("./programs/math.js");
const ref = require("./programs/ref.js");

new Obelus.Bot(process.env.BOT_TOKEN).addProgram(connectFour, math, ref).run();
