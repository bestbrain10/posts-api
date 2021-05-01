const { mockNext, mockRequest, mockResponse } = require('../../__mocks__/http');
const LoginController = require('./login.controller');
const User = require('../../users/models/user.model');
const Login = require('../models/login.model');
const joiValidator = require('../../common/utils/joi-validator');


describe('Login Controller', () => {

	it('login schema fails with invalid payload', async () => {
		const payload = {};

		try {
			await joiValidator.validate(payload, LoginController.loginSchema);
		} catch (e) {
			expect(e).toEqual({
				email: 'email is required',
				password: 'password is required'
			});
		}
	});

	it('login schema fails with invalid email', async () => {
		const payload = {
			email: 'notvalid'
		};

		try {
			await joiValidator.validate(payload, LoginController.loginSchema);
		} catch (e) {
			expect(e).toEqual({
				email: 'email must be a valid email',
				password: 'password is required'
			});
		}
	});

	it('login schema passes with valid payload', async () => {
		const payload = {
			email: 'tony@avengers.com',
			password: 'hope'
		};

		const result = await joiValidator.validate(payload, LoginController.loginSchema);
		expect(result).toEqual(payload);
	});

	it('Can Login', async () => {
		const req = mockRequest({
			body: {
				email: 'ironman@avengers.com',
				password: 'password'
			}
		});
		const res = mockResponse();

		const userLoginSpy = jest.spyOn(User, 'login');
		userLoginSpy.mockResolvedValueOnce({
			id: 5
		});

		const loginSpy = jest.spyOn(Login, 'loginUser');
		loginSpy.mockResolvedValueOnce({
			id: 5,
			token: 'sdsdsd'
		});

		await LoginController.login(req, res, mockNext);

		expect(res.data).toBeCalledWith({
			id: 5,
			token: 'sdsdsd'
		});
	});
});