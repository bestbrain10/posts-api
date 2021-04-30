const { Model, DataTypes, Sequelize } = require('sequelize');
const jwt = require('../../common/utils/jwt');
const DB = require('../../database');

class Login extends Model {
	static async logoutUser(loginID) {
		const [count] = await this.update({
			loggedOut: true,
			loggedOutAt: Sequelize.literal('CURRENT_TIMESTAMP')
		},{
			where: { 
				id: loginID,
				loggedOut: false,
			},
		});

		return !!count;
	}

	static decodeLoginToken(token) {
		try {
			const decoded = jwt.decode(token);
			if (!decoded || !decoded.loginID) {
				return null;
			}
			return decoded.loginID;
		} catch(e) {
			return null;
		}
	}

	static verifyLogin(loginID) {
		return this.findOne({
			where: {
				id: loginID,
				loggedOut: false
			},
			attributes: ['user']
		});
	}

	static async loginUser(user) {
		const userLogin = await this.create({
			user: user.id
		});

		return Object.assign(user, {
			token: jwt.encode({ loginID: userLogin.id })
		});
	}
}

Login.init({
	id: {
		type: DataTypes.UUID,
		allowNull: false,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true
	},
	user: {
		type: DataTypes.UUID,
		allowNull: false
	},
	loggedOut: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
	loggedOutAt: {
		type: 'TIMESTAMP',
	}
}, {
	tableName: 'logins',
	underscored: true,
	timestamps: true,
	sequelize: DB
});

module.exports = Login;