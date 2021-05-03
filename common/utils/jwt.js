const jwt = require('jsonwebtoken');

module.exports = {
	encode(payload) {
		return jwt.sign(payload, process.env.JWTKEY);
	},
	decode(payload) {
		return jwt.verify(payload, process.env.JWTKEY);
	},
};
