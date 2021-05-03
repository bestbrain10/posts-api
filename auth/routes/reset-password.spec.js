require('dotenv').config();
process.env.NODE_ENV = 'test';

const request = require('supertest');
const server = require('../../server');
const database = require('../../database');
const User = require('../../users/models/user.model');
const passwordResetUtil = require('../../__mocks__/reset-password');


describe('Password Reset API', () => {

	beforeAll(async () => {
		await database.authenticate();
	});

	afterAll(async () => {
		await database.close();
	});

	describe('Password reset request fails without payload', () => {
		let response;

		beforeAll(async () => {
			response = await request(server).post('/password-reset-request');
		});

		it('returns 400 status code', () => {
			expect(response.statusCode).toBe(400);
		});

		it('returns error message', () => {
			expect(response.body).toEqual({
				error: {
					email: 'email is required',
				},
				message: 'An error occured',
				status: 'error',
			});
		});
	});

	describe('Password reset request fails if email does not exist', () => {
		let response;

		beforeAll(async () => {
			response = await request(server).post('/password-reset-request').send({ email: 'nebulafrom2014@avengers.com' });
		});

		it('returns 400 status code', () => {
			expect(response.statusCode).toBe(400);
		});

		it('returns error message', () => {
			expect(response.body).toEqual({
				error: {
					email: 'User account does not exist',
				},
				message: 'An error occured',
				status: 'error',
			});
		});
	});

	describe('Password reset request succeeds with payload', () => {
		let response;
		const demoEmail = 'ironman@avengers.com';

		beforeAll(async () => {
			await User.findOrCreate({
				where: {
					email: demoEmail
				},
				defaults: {
					fullname: 'Tony Stark',
					email: demoEmail,
					password: 'hashofpassword'
				}
			});
			response = await request(server).post('/password-reset-request').send({ email: demoEmail });
		});

		it('returns 200 status code', () => {
			expect(response.statusCode).toBe(200);
		});

		it('returns success message', () => {
			expect(response.body).toEqual({
				data: {
					processed: true,
				},
				status: 'success',
			});
		});
	});

	describe('Cannot reset password without password payload', () => {
		let response;

		beforeAll(async () => {
			// const token = await passwordResetUtil();
			response = await request(server).post('/password-reset/token');
		});

		it('returns 400 status code', () => {
			expect(response.statusCode).toBe(400);
		});

		it('returns error message', () => {
			expect(response.body).toEqual({
				error: {
					password: 'password is required',
					repeat_password: 'repeat_password is required',
				},
				message: 'An error occured',
				status: 'error',
			});
		});
	});

	describe('Cannot reset password with invalid token', () => {
		let response;

		beforeAll(async () => {
			// const token = await passwordResetUtil();
			response = await request(server).post('/password-reset/token').send({
				password: 'stuff',
				repeat_password: 'stuff'
			});
		});

		it('returns 400 status code', () => {
			expect(response.statusCode).toBe(400);
		});

		it('returns error message', () => {
			expect(response.body).toEqual({
				message: 'invalid password reset token',
				status: 'error',
			});
		});
	});

	describe('Cannot reset password without repeating passwords correctly', () => {
		let response;

		beforeAll(async () => {
			// const token = await passwordResetUtil();
			response = await request(server).post('/password-reset/token').send({
				password: 'stuff',
				repeat_password: 'stuff again'
			});
		});

		it('returns 400 status code', () => {
			expect(response.statusCode).toBe(400);
		});

		it('returns error message', () => {
			expect(response.body).toEqual({
				message: 'An error occured',
				error: {
					repeat_password: 'Passwords do not match',
				},
				status: 'error',
			});
		});
	});

	describe('Cannot reset password with expired token', () => {
		let response;

		beforeAll(async () => {
			const token = await passwordResetUtil(false);
			response = await request(server).post(`/password-reset/${token}`).send({
				password: 'stuff',
				repeat_password: 'stuff'
			});
		});

		it('returns 400 status code', () => {
			expect(response.statusCode).toBe(400);
		});

		it('returns error message', () => {
			expect(response.body).toEqual({
				message: 'token expired, try requesting for another one',
				status: 'error',
			});
		});
	});

	describe('Can reset password with valid token', () => {
		let response;

		beforeAll(async () => {
			const token = await passwordResetUtil();
			response = await request(server).post(`/password-reset/${token}`).send({
				password: 'stuff',
				repeat_password: 'stuff'
			});
		});

		it('returns 200 status code', () => {
			expect(response.statusCode).toBe(200);
		});

		it('returns success message', () => {
			expect(response.body).toEqual({
				data: { processed: true },
				status: 'success',
			});
		});
	});
});