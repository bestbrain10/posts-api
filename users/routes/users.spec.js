require('dotenv').config();

const request = require('supertest');
const server = require('../../server');
const database = require('../../database');
const userSeeder = require('../../__mocks__/user');
const _ = require('lodash');
const { v4: uuid } = require('uuid');


const email = `bruce${uuid()}@avengers.com`;


describe('User API', () => {
	let authDetails;
	beforeAll(async () => {
		await database.authenticate();
		authDetails = await userSeeder({
			email,
			fullname: 'Bruce Banners'
		});
	});

	afterAll(async () => {
		await database.close();
	});

	describe('Can view User Profile', () => {
		let response;
		beforeAll(async () => {
			const { token } = authDetails;
			response = await request(server).get('/users/profile').set('Authorization', `Bearer ${token}`);
		});

		it('returns 200 status code', () => {
			expect(response.status).toBe(200);
		});

		it('returns user profile', () => {
			expect(Object.keys(response.body.data).sort())
				.toEqual(['email', 'fullname', 'id', 'createdAt', 'updatedAt'].sort());
		});
	});

	describe('Can view a User By ID', () => {
		let response;
		beforeAll(async () => {
			const { id } = await userSeeder();
			const { token } = authDetails;
			response = await request(server).get(`/users/${id}`).set('Authorization', `Bearer ${token}`);
		});

		it('returns 200 status code', () => {
			expect(response.status).toBe(200);
		});

		it('returns user profile', () => {
			expect(Object.keys(response.body.data).sort())
				.toEqual(['email', 'fullname', 'id', 'createdAt', 'updatedAt'].sort());
		});
	});

	describe('Can fetch multiple users', () => {
		let response;
		beforeAll(async () => {
			const { token } = authDetails;
			response = await request(server).get('/users').set('Authorization', `Bearer ${token}`);
		});

		it('returns 200 status code', () => {
			expect(response.status).toBe(200);
		});

		it('returns user profile', () => {
			expect(response.body.data).toBeInstanceOf(Array);
			const expectedKeys = ['email', 'fullname', 'id', 'createdAt', 'updatedAt'].sort();
			expect(response.body.data.every(user => {
				return !_.difference(Object.keys(user).sort(), expectedKeys).length;
			}))
				.toEqual(true);
		});
	});

	describe('Can change password', () => {
		let response;
		beforeAll(async () => {
			const { token } = authDetails;
			response = await request(server).put('/users/changepassword').send({
				password: 'password',
				new_password: 'password_new',
				new_password_repeat: 'password_new'
			}).set('Authorization', `Bearer ${token}`);
		});

		it('returns 200 status code', () => {
			expect(response.status).toBe(200);
		});

		it('returns true', () => {
			expect(response.body).toEqual({
				data: true,
				status: 'success'
			});
		});
	});

	describe('Can\'t change password if password is incorrect', () => {
		let response;
		beforeAll(async () => {
			const { token } = await userSeeder({ password: 'password' });
			response = await request(server).put('/users/changepassword').send({
				password: 'passwordishsubstance',
				new_password: 'password_new',
				new_password_repeat: 'password_new'
			}).set('Authorization', `Bearer ${token}`);
		});

		it('returns 400 status code', () => {
			expect(response.status).toBe(400);
		});

		it('returns true', () => {
			expect(response.body).toEqual({
				error : { 
					password: 'Incorrect password',
				},
				message: 'An error occured',
				status: 'error',
			});
		});
	});

	describe('Can\'t change password if new password is not correctly repeated', () => {
		let response;
		beforeAll(async () => {
			const { token } = await userSeeder({
				password: 'password'
			});
			response = await request(server).put('/users/changepassword').send({
				password: 'password',
				new_password: 'password_new',
				new_password_repeat: 'password_not_new'
			}).set('Authorization', `Bearer ${token}`);
		});

		it('returns 400 status code', () => {
			expect(response.status).toBe(400);
		});

		it('returns true', () => {
			expect(response.body).toEqual({
				error: {
					new_password_repeat: 'Password do not match'
				},
				message: 'An error occured',
				status: 'error',
			});
		});
	});
});