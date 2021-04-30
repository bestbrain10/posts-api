const { mockRequest, mockResponse, mockNext } = require('../../__mocks__/http');
const authMiddleware = require('./auth.middleware');
const User = require('../../models/user.model');
const Login = require('../../models/login.model');

describe('Auth Middleware', () => {
	it('returns error if Authorization header is missing', async () => {
		const req = mockRequest({
		});
		const res = mockResponse();

		await authMiddleware(req, res, mockNext);

		expect(res.status).toBeCalledWith(401);
		expect(res.errorMessage).toBeCalledWith('Unauthorized, provide access token');
	});

	it('returns error if Authorization token cannot be decoded', async () => {
		const req = mockRequest({
			headers: {
				Authorization: '1234567890'
			}
		});
		const res = mockResponse();

		const decodeSpy = jest.spyOn(Login, 'decodeLoginToken').mockReturnValueOnce(null);

		await authMiddleware(req, res, mockNext);

		expect(decodeSpy).toBeCalledWith('890');
		expect(res.status).toBeCalledWith(401);
		expect(res.errorMessage).toBeCalledWith('Invalid token passed');
	});

	it('returns error if login could not be verified', async () => {
		const req = mockRequest({
			headers: {
				Authorization: '1234567890'
			}
		});
		const res = mockResponse();
		const loginID = 50;

		jest.spyOn(Login, 'decodeLoginToken').mockReturnValueOnce(loginID);
		const verifySpy = jest.spyOn(Login, 'verifyLogin').mockResolvedValueOnce(null);

		await authMiddleware(req, res, mockNext);

		expect(verifySpy).toBeCalledWith(loginID);

		expect(res.status).toBeCalledWith(401);
		expect(res.errorMessage).toBeCalledWith('Login session expired or does not exist');
	});

	it('returns error if user could not be found', async () => {
		const req = mockRequest({
			headers: {
				Authorization: '1234567890'
			}
		});
		const res = mockResponse();
		const loginID = 50;

		jest.spyOn(Login, 'decodeLoginToken').mockReturnValueOnce(loginID);
		jest.spyOn(Login, 'verifyLogin').mockResolvedValueOnce({ user: 89 });
		const findSpy = jest.spyOn(User, 'findByPk').mockResolvedValueOnce(null);

		await authMiddleware(req, res, mockNext);

		expect(findSpy).toBeCalledWith(89);

		expect(res.status).toBeCalledWith(401);
		expect(res.errorMessage).toBeCalledWith('Login session expired or does not exist');
	});

	it('moves to next middleware if user was found from token', async () => {
		const req = mockRequest({
			headers: {
				Authorization: '1234567890'
			}
		});
		const res = mockResponse();
		const loginID = 50;

		jest.spyOn(Login, 'decodeLoginToken').mockReturnValueOnce(loginID);
		jest.spyOn(Login, 'verifyLogin').mockResolvedValueOnce({
			user: 89
		});

		const jsonSpy = jest.fn().mockReturnValueOnce({
			id: 5,
			fullname: 'Scott Lang'
		});
		jest.spyOn(User, 'findByPk').mockResolvedValueOnce({ toJSON: jsonSpy });

		const next = jest.fn();

		await authMiddleware(req, res, next);

		expect(jsonSpy).toBeCalled();
		expect(req.user).toMatchObject({
			id: 5,
			fullname: 'Scott Lang'
		});
		expect(req.loginID).toBe(loginID);

		expect(next).toBeCalled();
	});
});