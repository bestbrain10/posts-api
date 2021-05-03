const hashPassword = require('../../common/utils/hash-password');

module.exports = (user) => {
	user.password = hashPassword(user.password);
};