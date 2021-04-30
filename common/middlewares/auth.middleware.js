const User = require('../../users/models/user.model');
const Login = require('../../models/login.model');


module.exports = async (req, res, next) => {
	const header = req.get('Authorization');
    
	if(!header) {
		return res.status(401).errorMessage('Unauthorized, provide access token');
	}

	const token = header.slice(7);
	const loginID = Login.decodeLoginToken(token);
	if(!loginID) {
		return res.status(401).errorMessage('Invalid token passed');
	}
    
	const loginDetails = await Login.verifyLogin(loginID);

	if(!loginDetails) {
		return res.status(401).errorMessage('Login session expired or does not exist');
	}

	const user = await User.findByPk(loginDetails.user);

	if(!user) {
		return res.status(401).errorMessage('Login session expired or does not exist');
	}

	req.user = user.toJSON();
	req.loginID = loginID;

	next();
};