
const User = require('../users/models/user.model');
const Login = require('../auth/models/login.model');
const { v4: uuid } = require('uuid');


module.exports = async ({ fullname = 'Anon Avenger', email, password = 'password' } = {}) => {
	email = email || `agent${uuid()}@avengers.com`;
	await User.register({
		email,
		password,
		fullname
	}, false);
	const user = await User.login({
		email,
		password
	});
	return  Login.loginUser(user);
};