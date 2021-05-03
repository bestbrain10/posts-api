
const Joi = require('joi');
const User = require('../models/user.model');

module.exports = class {
	// eslint-disable-next-line no-unused-vars
	static async profile(req, res, next) {
		res.data(req.user);
	}

	// eslint-disable-next-line no-unused-vars
	static async getAllUsers(req, res, next) {
		const { limit = 30, skip = 0 } = req.query;
		res.data(
			await User.findAll({
				limit,
				offset: skip
			})
		);
	}

	// eslint-disable-next-line no-unused-vars
	static async getOneUser(req, res, next) {
		const user = await User.findByPk(req.params.user);

		if(!user) {
			return res.status(404).errorMessage('User not found');
		}

		res.data(user.toJSON());
	}

	static get changePasswordSchema() {
		return Joi.object().keys({
			password: Joi.string().required(),
			new_password: Joi.string().required(),
			new_password_repeat: Joi.string().required()
		});
	}

	static passwordRepeatCheck(req, res, next) {
		const { new_password: newPassword, new_password_repeat: newPasswordRepeat } = req.body;
		if(newPassword === newPasswordRepeat) {
			req.body = {
				password: req.body.password,
				newPassword,
			};
			return next();
		}

		return res.status(400).error({ new_password_repeat: 'Password do not match' });
	}

	// eslint-disable-next-line no-unused-vars
	static async changePassword(req, res, next) {
		const user = await User.changePassword({
			userID: req.user.id,
			...req.body
		});

		res.data(user);
	}
};