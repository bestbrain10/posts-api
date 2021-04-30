const { mockNext, mockRequest, mockResponse } = require('../../__mocks__/http');
const SignupController = require('./signup.controller');
const User = require('../../users/models/user.model');


describe('Signup Controller', () => {
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