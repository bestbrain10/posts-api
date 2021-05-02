const User = require('../users/models/user.model');
const jwt = require('../common/utils/jwt');
const { v4: uuid } = require('uuid');

module.exports = async (forward = true) => {
	const email = `nickfury${uuid()}@avengers.com`;
	const [user] = await User.findOrCreate({
		where: { email },
		defaults: { 
			email,
			fullname: 'Nick Fury',
			password: 'eyepatch'
		}
	});
	
	const multiplier = forward ? 1 : -1;
	return jwt.encode({
		user: user.id,
		exp: Math.floor(Date.now() / 1000) + (60 * 60 * multiplier),
	});
};
