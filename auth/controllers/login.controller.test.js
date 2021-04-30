const { mockNext, mockRequest, mockResponse } = require('../__mocks__/http');
const LoginController = require('./login.controller');
const User = require('../models/user.model');
const Login = require('../models/login.model');


describe('Login Controller', () => {
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