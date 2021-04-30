const joi = require('joi');
const User = require('../../users/models/user.model');

module.exports = class {

	static get registerSchema() {
		return joi.object().keys({
			fullname: joi.string().required(),
			email: joi.string().email().required(),
			password: joi.string().required()
		});
	}

	// eslint-disable-next-line no-unused-vars
	static async register(req, res, next) {
		const response = await User.register(req.body);
		res.status(201).data( response );
	}
};