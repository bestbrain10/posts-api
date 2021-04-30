const Login = require('../models/login.model');

module.exports = class {
	static async logout(req, res) {
		return res.data(
			await Login.logoutUser(req.loginID)
		);
	}
};