require('dotenv').config();
process.env.NODE_ENV = 'test';

const request = require('supertest');
const server = require('../../server');
const database = require('../../database');
const User = require('../../users/models/user.model');


describe('Login API', () => {

	beforeAll(async () => {
		await database.authenticate();
	});

	afterAll(async () => {
		await database.close();
	});

	describe('Request fails without login payload', () => {
		let response;

		beforeAll(async () => {
			response = await request(server).post('/login');
		});

		it('returns 400 status code', () => {
			expect(response.statusCode).toBe(400);
		});

		it('returns error message', () => {
			expect(response.body).toEqual({
				error: {
					email: 'email is required',
					password: 'password is required'
				},
				message: 'An error occured',
				status: 'error',
			});
		});
	});

	describe('Request fails if email does not exist', () => {
		let response;

		beforeAll(async () => {
			response = await request(server).post('/login').send({
				email: 'loki@avengers.com',
				password: 'anythingICanthinkof'
			});
		});

		it('returns 400 status code', () => {
			expect(response.statusCode).toBe(400);
		});

		it('returns error message', () => {
			expect(response.body).toEqual({
				error: {
					email: 'Email does not exist',
				},
				message: 'An error occured',
				status: 'error',
			});
		});
	});

	describe('Request fails if password is wrong', () => {
		let response;
		const demoEmail = 'ironman@avengers.com';
		const requestArgs = {
			fullname: 'Tony Stark',
			email: demoEmail,
			password: 'hashofpassword'
		};

		beforeAll(async () => {
			await User.findOrCreate({
				where: {
					email: demoEmail
				},
				defaults: requestArgs
			});

			response = await request(server).post('/login').send({
				email: demoEmail,
				password: 'nothepassword'
			});
		});

		it('returns 400 status code', () => {
			expect(response.statusCode).toBe(400);
		});

		it('returns error message', () => {
			expect(response.body).toEqual({
				error: {
					password: 'Incorrect password',
				},
				message: 'An error occured',
				status: 'error',
			});
		});
	});

	describe('Request succeeds if email exists and password is correct', () => {
		let response;
		const demoEmail = 'ironman@avengers.com';
		const requestArgs = {
			fullname: 'Tony Stark',
			email: demoEmail,
			password: 'hashofpassword'
		};

		beforeAll(async () => {
			await User.findOrCreate({
				where: {
					email: demoEmail
				},
				defaults: requestArgs
			});

			response = await request(server).post('/login').send({
				email: demoEmail,
				password: 'hashofpassword'
			});
		});

		it('returns 200 status code', () => {
			expect(response.statusCode).toBe(200);
		});

		it('returns user object', () => {
			expect(response.body).toHaveProperty('status');
			expect(response.body).toHaveProperty('data');

			expect(Object.keys(response.body.data).sort())
				.toEqual(['email', 'fullname', 'id', 'createdAt', 'updatedAt', 'token'].sort());
		});
	});
});