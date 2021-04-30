require('dotenv').config();

const request = require('supertest');
const server = require('../server');
const database = require('../database');
const User = require('../models/user.model');
const { v4: uuid } = require('uuid');


describe('Signup API', () => {

	beforeAll(async () => {
		await database.authenticate();
	});

	afterAll(async () => {
		await database.close();
	});

	describe('Request fails if request body is empty', () => {
		let response;

		beforeAll(async () => {
			response = await request(server).post('/signup');
		});

		it('returns 400 status code', () => {
			expect(response.statusCode).toBe(400);
		});

		it('returns error message', () => {
			expect(response.body).toEqual({
				error: {
					fullname: 'fullname is required',
					email: 'email is required',
					password: 'password is required'
				},
				message: 'An error occured',
				status: 'error',
			});
		});
	});


	describe('Request fails if email is not unique', () => {
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

			response = await request(server).post('/signup').send(requestArgs);
		});

		it('returns 400 status code', () => {
			expect(response.statusCode).toBe(400);
		});

		it('returns error message', () => {
			expect(response.body).toEqual({
				error: {
					email: 'Email already exists',
				},
				message: 'An error occured',
				status: 'error',
			});
		});
	});

	describe('Request succeeds if email is unique', () => {
		let response;
		const requestArgs = {
			fullname: 'Sentry Suit',
			email: `${uuid()}@avengers.com`,
			password: 'hashofpassword'
		};

		beforeAll(async () => {
			response = await request(server).post('/signup').send(requestArgs);
		});

		it('returns 201 status code', () => {
			expect(response.statusCode).toBe(201);
		});

		it('returns user object', () => {
			expect(response.body).toHaveProperty('status');
			expect(response.body).toHaveProperty('data');

			expect(Object.keys(response.body.data).sort())
				.toEqual(['balance', 'email', 'fullname', 'id', 'createdAt', 'updatedAt'].sort());
		});
	});
});
