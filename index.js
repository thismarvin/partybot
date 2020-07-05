require("dotenv").config();

const Obelus = require("./src/lib/obelus/index.js");

const connectFour = require("./src/programs/connectFour.js");
const math = require("./src/programs/math.js");
const ref = require("./src/programs/ref.js");

new Obelus.Bot(process.env.BOT_TOKEN).addProgram(connectFour, math, ref).run();
