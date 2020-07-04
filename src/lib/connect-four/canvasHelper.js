const fs = require("fs");

function saveAsPNG(canvas, path, fileName) {
	return new Promise((resolve, reject) => {
		const out = fs.createWriteStream(`${path}/${fileName}`);
		const stream = canvas.createPNGStream();

		stream.pipe(out);
		out.on("finish", (error) => {
			if (error !== undefined) {
				reject(error);
				return;
			}

			resolve();
		});
	});
}

module.exports = {
	saveAsPNG: saveAsPNG,
};
