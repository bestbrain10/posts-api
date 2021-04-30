require('dotenv').config();

const { mockNext, mockRequest, mockResponse } = require('../__mocks__/http');
const LogoutController = require('./logout.controller');
const Login = require('../models/login.model');


describe('Logout Controller', () => {
	it('Can Logout', async () => {
		const req = mockRequest({
			loginID: 5
		});
		const res = mockResponse();

		const logoutSpy = jest.spyOn(Login, 'logoutUser');
		logoutSpy.mockResolvedValueOnce({
			id: 5
		});

		await LogoutController.logout(req, res, mockNext);
		expect(logoutSpy).toBeCalledWith(5);

		expect(res.data).toBeCalledWith({
			id: 5
		});
	});
});