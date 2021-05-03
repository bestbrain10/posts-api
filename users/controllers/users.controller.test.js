require('dotenv').config();

const { mockNext, mockRequest, mockResponse } = require('../../__mocks__/http');
const UsersController = require('./users.controller');
const User = require('../models/user.model');
const joiValidator = require('../../common/utils/joi-validator');

describe('User Controller', () => {
	describe('profile', () => {
		it('returns logged in user profile', async () => {
			const req = mockRequest({
				user: {
					id: 6,
					fullname: 'Thor Odinson'
				}
			});
			const res = mockResponse();

			await UsersController.profile(req, res, mockNext);

			expect(res.data).toBeCalledWith({
				id: 6,
				fullname: 'Thor Odinson',
			});
		});
	});

	describe('Find One User By ID', () => {
		it('It can find a user using URL params', async () => {
			const req = mockRequest({
				params: {
					user: 6,
				}
			});
			const res = mockResponse();

			const findSpy = jest.spyOn(User, 'findByPk').mockResolvedValueOnce({
				toJSON() {
					return {
						id: 6,
						fullname: 'Thor Odinson'
					};
				}
			});

			await UsersController.getOneUser(req, res, mockNext);

			expect(res.data).toBeCalledWith({
				id: 6,
				fullname: 'Thor Odinson',
			});

			expect(findSpy).toBeCalledWith(6);
		});

		it('returns 404 if user is not found', async () => {
			const req = mockRequest({
				params: {
					user: 6,
				}
			});
			const res = mockResponse();

			const findSpy = jest.spyOn(User, 'findByPk').mockResolvedValueOnce(null);

			await UsersController.getOneUser(req, res, mockNext);

			expect(res.status).toBeCalledWith(404);
			expect(res.errorMessage).toBeCalledWith('User not found');

			expect(findSpy).toBeCalledWith(6);
		});
	});

	describe('Get All User', () => {
		it('Fetches all users using default Pagination', async () => {
			const req = mockRequest();
			const res = mockResponse();

			const findSpy = jest.spyOn(User, 'findAll').mockResolvedValueOnce([
				{id: 1},
				{id: 2},
			]);

			await UsersController.getAllUsers(req, res, mockNext);

			expect(res.data).toBeCalledWith([
				{id: 1},
				{id: 2},
			]);

			expect(findSpy).toBeCalledWith({
				limit: 30,
				offset: 0
			});
		});

		it('Fetches all users using input Pagination', async () => {
			const req = mockRequest({
				query: {
					skip: 3,
					limit: 60
				}
			});
			const res = mockResponse();

			const findSpy = jest.spyOn(User, 'findAll').mockResolvedValueOnce([
				{id: 1},
				{id: 2},
			]);

			await UsersController.getAllUsers(req, res, mockNext);

			expect(res.data).toBeCalledWith([
				{id: 1},
				{id: 2},
			]);

			expect(findSpy).toBeCalledWith({
				limit: 60,
				offset: 3
			});
		});
	});

	describe('Check password repeat', () => {
		it('calls next if password is repeated correctly', () => {
			const req = mockRequest({
				body: {
					password: 'snap',
					new_password: 'clap',
					new_password_repeat: 'clap'
				}
			});

			const res = mockResponse();
			const next = jest.fn();
			UsersController.passwordRepeatCheck(req, res, next);

			expect(next).toBeCalled();
			expect(req.body).toMatchObject({
				password: 'snap',
				newPassword: 'clap'
			});
		});

		it('returns error if password is not repeated correctly', () => {
			const req = mockRequest({
				body: {
					password: 'snap',
					new_password: 'clap',
					new_password_repeat: 'smash'
				}
			});

			const res = mockResponse();
			const next = jest.fn();
			UsersController.passwordRepeatCheck(req, res, next);

			expect(res.status).toBeCalledWith(400);
			expect(res.error).toBeCalledWith({
				new_password_repeat: 'Password do not match'
			});
		});
	});

	describe('Change Password Schema', () => {
		it('fails validation for invalid payload', async () => {
			const payload = {
				password: 'snap',
				new_password: 'clap',
				new_password_repeat: 'clap'
			};
			const result = await joiValidator.validate(payload, UsersController.changePasswordSchema);
			expect(result).toMatchObject(payload);
		});

		it('passes validation for valid payload', async () => {
			const payload = {
				password: 'snap',
				new_password: 'clap',
				new_password_repeat: 'smash'
			};
			try {
				await joiValidator.validate(payload, UsersController.changePasswordSchema);
			} catch(e) {
				expect(e).toMatchObject(payload);
			}
		});
	});

	describe('Change Password', () => {
		it('Changes User Password', async () => {
			const req = mockRequest({
				body: {
					password: 'smash',
					newPassword: 'clapp'
				},
				user: {
					id: '134'
				}
			});

			const res = mockResponse();

			const passwordSpy = jest.spyOn(User, 'changePassword').mockResolvedValueOnce(true);

			await UsersController.changePassword(req, res, mockNext);

			expect(passwordSpy).toBeCalledWith({
				userID: '134',
				password: 'smash',
				newPassword: 'clapp'
			});

			expect(res.data).toBeCalledWith(true);
		});
	});
});


