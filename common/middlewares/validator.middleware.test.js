
const { mockRequest, mockResponse, mockNext, } = require('../../__mocks__/http');
const validatorMiddleware = require('./validator.middleware');
const joi = require('joi');


describe('Validator Middleware', () => {
	it('Invalid Schema throws error message', async () => {
		const req = mockRequest();
		const res = mockResponse();
		const message = 'errors here';
		const attemptSpy = jest.spyOn(joi, 'attempt').mockRejectedValue({ message });
		await validatorMiddleware(joi.object().keys({
			greet: joi.string().error(new Error(message))
		}))(req, res, mockNext);

		expect(attemptSpy).toBeCalled();

		expect(res.status).toBeCalledWith(400);
		expect(res.error).toBeCalledWith(message);
	});

	it('can modify joi error message to simple json', async () => {
		const req = mockRequest();
		const res = mockResponse();
		const message = 'errors here';
		const attemptSpy = jest.spyOn(joi, 'attempt').mockRejectedValue({
			details: [
				{
					context: {
						label: 'powers',
					},
					message: 'stuff about "power"'
				}, {
					context: {
						key: 'weapon',
					},
					message: 'stuff about "weapon"'
				}
			]
		});
		await validatorMiddleware(joi.object().keys({
			greet: joi.string().error(new Error(message))
		}))(req, res, mockNext);

		expect(attemptSpy).toBeCalled();

		expect(res.status).toBeCalledWith(400);
		expect(res.error).toBeCalledWith({
			powers: 'stuff about power',
			weapon: 'stuff about weapon'
		});
	});

	it('passes transformed body to next middleware for successful validation', async () => {
		const req = mockRequest({
			body: { uhmm: 'I am not needed' }
		});
		const res = mockResponse();
		const message = 'errors here';
		jest.spyOn(joi, 'attempt').mockResolvedValue({
			powers: 'stuff about power',
			weapon: 'stuff about weapon'
		});

		const next = jest.fn();
		await validatorMiddleware(joi.object().keys({
			greet: joi.string().error(new Error(message))
		}))(req, res, next);

		expect(next).toBeCalled();
		expect(req.bodyOld).toEqual({
			uhmm: 'I am not needed'
		});
		expect(req.body).toEqual({
			powers: 'stuff about power',
			weapon: 'stuff about weapon'
		});
	});
});