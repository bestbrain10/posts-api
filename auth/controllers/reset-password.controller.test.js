const { mockNext, mockRequest, mockResponse } = require('../../__mocks__/http');
const ResetPasswordController = require('./reset-password.controller');
const User = require('../../users/models/user.model');
const joiValidator = require('../../common/utils/joi-validator');

describe('Reset Password Controller', () => {
	it('reset password schema fails with invalid payload', async () => {
		const payload = {};

		try {
			await joiValidator.validate(payload, ResetPasswordController.resetPasswordSchema);
		} catch (e) {
			expect(e).toEqual({
				repeat_password: 'repeat_password is required',
				password: 'password is required'
			});
		}
	});

	it('reset password schema passes with valid payload', async () => {
		const payload = {
			repeat_password: 'hope',
			password: 'hope'
		};

		const result = await joiValidator.validate(payload, ResetPasswordController.resetPasswordSchema);
		expect(result).toEqual(payload);
	});

	it('Can Reset Password', async () => {
		const req = mockRequest({
			body: {
				repeat_password: 'hope',
				password: 'hope'
			},
			params: {
				token: 'token'
			}
		});
		const res = mockResponse();

		const resetSpy = jest.spyOn(User, 'resetPassword').mockResolvedValueOnce(true);

		await ResetPasswordController.resetPassword(req, res, mockNext);

		expect(res.data).toBeCalledWith({
			processed: true
		});
		expect(resetSpy).toBeCalledWith({
			token: 'token',
			password: 'hope'
		});
	});


	it('reset password request schema fails with invalid payload', async () => {
		const payload = {};

		try {
			await joiValidator.validate(payload, ResetPasswordController.requestPasswordResetSchema);
		} catch (e) {
			expect(e).toEqual({
				email: 'email is required'
			});
		}
	});

	it('reset password request schema passes with valid payload', async () => {
		const payload = {
			email: 'hope@email.com',
		};

		const result = await joiValidator.validate(payload, ResetPasswordController.requestPasswordResetSchema);
		expect(result).toEqual(payload);
	});

	it('Can request for password reset link', async () => {
		const req = mockRequest({
			body: {
				email: 'hope@email.com'
			}
		});
		const res = mockResponse();

		const resetSpy = jest.spyOn(User, 'requestPasswordReset').mockResolvedValueOnce(true);

		await ResetPasswordController.requestPasswordReset(req, res, mockNext);

		expect(res.data).toBeCalledWith({
			processed: true
		});
		expect(resetSpy).toBeCalledWith('hope@email.com');
	});

	it('Password repeated correctly invokes next route', async () => {
		const req = mockRequest({
			body: {
				repeat_password: 'hope',
				password: 'hope'
			}
		});
		const res = mockResponse();
		const next = jest.fn();

		await ResetPasswordController.checkPasswordRepeat(req, res, next);
		expect(next).toBeCalled();
	});

	it('Password repeated incorrectly returns error', async () => {
		const req = mockRequest({
			body: {
				repeat_password: 'nope',
				password: 'hope'
			}
		});
		const res = mockResponse();

		await ResetPasswordController.checkPasswordRepeat(req, res, mockNext);
		expect(res.status).toBeCalledWith(400);
		expect(res.error).toBeCalledWith({ repeat_password: 'Passwords do not match' });
	});
});