class PseudoRegex {
	constructor(expression) {
		this.aliases = [];
		this.flag = "";

		const formatted = expression.toLowerCase().trim();

		if (formatted.indexOf("|") >= 0) {
			const aliases = formatted.split("|");

			for (let alias of aliases) {
				this.aliases.push(alias.trim());
			}
		} else {
			this.aliases.push(formatted);
		}
	}

	test(string) {
		const formatted = string.toLowerCase();
		for (let alias of this.aliases) {
			if (`${formatted.substring(0, alias.length)} ` === `${alias} `) {
				return true;
			}
		}

		return false;
	}

	toString() {
		return this.aliases.toString();
	}
}

module.exports = PseudoRegex;
