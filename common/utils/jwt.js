const jwt = require('jsonwebtoken');
const { JWTKEY } = process.env;

module.exports = {
	encode(payload) {
		return jwt.sign(payload, JWTKEY);
	},
	decode(payload) {
		return jwt.verify(payload, JWTKEY);
	},
};
