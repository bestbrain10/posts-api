const { mockNext, mockRequest, mockResponse } = require('../../__mocks__/http');
const SignupController = require('./signup.controller');
const User = require('../../users/models/user.model');
const joiValidator = require('../../common/utils/joi-validator');

describe('Signup Controller', () => {
	it('register schema fails with invalid payload', async () => {
		const payload = {};

		try {
			await joiValidator.validate(payload, SignupController.registerSchema);
		} catch (e) {
			expect(e).toEqual({
				email: 'email is required',
				fullname: 'fullname is required',
				password: 'password is required'
			});
		}
	});

	it('register schema fails with invalid email', async () => {
		const payload = {
			email: 'notvalid'
		};

		try {
			await joiValidator.validate(payload, SignupController.registerSchema);
		} catch (e) {
			expect(e).toEqual({
				email: 'email must be a valid email',
				fullname: 'fullname is required',
				password: 'password is required'
			});
		}
	});

	it('register schema passes with valid payload', async () => {
		const payload = {
			email: 'tony@avengers.com',
			fullname: 'Tony Stark',
			password: 'hope'
		};

		const result = await joiValidator.validate(payload, SignupController.registerSchema);
		expect(result).toEqual(payload);
	});

	it('Can Signup', async () => {
		const req = mockRequest({
			body: {
				email: 'ironman@avengers.com',
				password: 'password',
				fullname: 'Tony Stark'
			}
		});
		const res = mockResponse();

		const userSignupSpy = jest.spyOn(User, 'register');
		userSignupSpy.mockResolvedValueOnce({
			id: '1'
		});

		await SignupController.register(req, res, mockNext);

		expect(res.status).toBeCalledWith(201);
		expect(res.data).toBeCalledWith({
			id: '1'
		});
	});
});