const { Model, DataTypes, } = require('sequelize');
const hashPassword = require('../common/utils/hash-password');
const DB = require('../database');
const { omit } = require('lodash');

class User extends Model {

	/**
     * compares input password with stored hash
     * @param {string} inputPassword 
     * @returns 
     */
	comparePassword(inputPassword) {
		return this.password === hashPassword(inputPassword);
	}


	/**
     * Registers a new user, makes sure email is unique
     * @param {object} user 
     * @returns 
     */
	static async register(user) {
		const emailExists = await this.count({
			where: { email: user.email },
		});

		if(emailExists) {
			return Promise.reject({ email: 'Email already exists' });
		}

		const newUser =  await this.create({
			...user,
			balance: 0
		});

		return omit(newUser.toJSON(), ['password']);
	}

	/**
     * Logs in a user, checks for password and email correctness
     * @param {object} loginParams
	 * @param {string} loginParams.email
	 * @param {string} loginParams.password 
     * @returns 
     */
	static async login({ email, password }) {
		const user = await this.scope('withPassword').findOne({
			where: {
				email
			},
		});

		if (!user) {
			return Promise.reject({ email: 'Email does not exist' });
		}

		if(!user.comparePassword(password)) {
			return Promise.reject({ password: 'Incorrect password' });            
		}

		return omit(user.toJSON(), ['password']);
	}
}

User.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	fullname: DataTypes.STRING,
	email: DataTypes.STRING,
	password: DataTypes.STRING,
}, {
	tableName: 'users',
	underscored: true,
	timestamps: true,
	defaultScope: {
		attributes: { exclude: ['password'] }
	},
	scopes: { 
		withPassword: { attributes: {} }
	},
	sequelize: DB
});

User.beforeCreate((user) => {
	user.password = hashPassword(user.password);
});

module.exports = User;