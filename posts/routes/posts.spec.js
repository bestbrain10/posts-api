require('dotenv').config();

const request = require('supertest');
const server = require('../../server');
const database = require('../../database');
const userSeeder = require('../../__mocks__/user');
const _ = require('lodash');
const { v4: uuid } = require('uuid');


const email = `steve${uuid()}@avengers.com`;

describe('Post API', () => {
	let authDetails;
	beforeAll(async () => {
		await database.authenticate();
		authDetails = await userSeeder({
            email,
			fullname: 'Steve Rogers'
		});
	});

	afterAll(async () => {
		await database.close();
	});


	describe('Can create post', () => {
		let response;
		beforeAll(async () => {
			const { token } = authDetails;
			response = await request(server).post('/posts').send({ post_body: 'something' }).set('Authorization', `Bearer ${token}`);
		});

		it('returns 201 status code', () => {
            console.log(response.body);
			expect(response.status).toBe(201);
		});

		it('returns post details', () => {
			expect(Object.keys(response.body.data).sort())
				.toEqual(['email', 'fullname', 'id', 'createdAt', 'updatedAt'].sort());
		});
	});
});
