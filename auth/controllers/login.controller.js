const joi = require('joi');
const LoginRepository = require('../repositories/login.repository');


module.exports = class {
	static get loginSchema() {
		return joi.object().keys({
			email: joi.string().email().required(),
			password: joi.string().required()
		});
	}

	// eslint-disable-next-line no-unused-vars
	static async login(req, res, next) {
		res.data(
			await LoginRepository.loginUser(req.body)
		);
	}
};