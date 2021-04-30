const User = require('../models/user.model');
const Login = require('../models/login.model');

module.exports = class {
    static async loginUser({ email, password }) {
        const user = await User.login({ email, password });
        return Login.loginUser(user)
    }
}