
const Joi = require('joi');
const User = require('../../users/models/user.model');

module.exports = class {

	static checkPasswordRepeat(req, res, next) {
		const { password, repeat_password: repeatPassword } = req.body;

		if (password !== repeatPassword) {
			return res.status(400).error({ repeat_password: 'Passwords do not match' });
		}

		next();
	}

	static get resetPasswordSchema() {
		return Joi.object().keys({
			password: Joi.string().required(),
			repeat_password: Joi.string().required()
		});
	}

	// eslint-disable-next-line no-unused-vars
	static async resetPassword(req, res, next) {
		const reset = await User.resetPassword({
			token: req.params.token,
			password: req.body.password	
		});

		res.data({ processed: reset });
	}

	static get requestPasswordResetSchema() {
		return Joi.object().keys({
			email: Joi.string().email().required()
		});
	}

	// eslint-disable-next-line no-unused-vars
	static async requestPasswordReset(req, res, next) {
		const request = await User.requestPasswordReset(req.body.email);

		res.data({ processed: request });
	}
};