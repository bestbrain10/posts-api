require('dotenv').config();

const request = require('supertest');
const server = require('../../server');
const database = require('../../database');
const userSeeder = require('../../__mocks__/user');
const postSeeder = require('../../__mocks__/post');
const likeSeeder = require('../../__mocks__/like');
const { v4: uuid } = require('uuid');

const email = `bucky${uuid()}@avengers.com`;

describe('Likes API', () => {

	let authDetails;
	beforeAll(async () => {
		await database.authenticate();
		authDetails = await userSeeder({
			email,
			fullname: 'Bucky Dude'
		});
	});

	afterAll(async () => {
		await database.close();
	});

	describe('Cannot like a non-existing post', () => {
		let response;
		beforeAll(async () => {
			const { token } = authDetails;
			const postID = uuid();
			response = await request(server).post(`/posts/${postID}/likes`).set('Authorization', `Bearer ${token}`);
		});

		it('returns 404 status code', () => {
			expect(response.status).toBe(404);
		});

		it('returns like status', () => {
			expect(response.body).toEqual({
				error: {
					post: 'post does not exist'
				},
				message: 'An error occured',
				status: 'error'
			});
		});
	});

	describe('Can like a post', () => {
		let response;
		beforeAll(async () => {
			const { token, id } = authDetails;
			const { id: postID } = await postSeeder({
				postBody: 'something',
				createdBy: id
			});
			response = await request(server).post(`/posts/${postID}/likes`).set('Authorization', `Bearer ${token}`);
		});

		it('returns 200 status code', () => {
			expect(response.status).toBe(200);
		});

		it('returns like status', () => {
			expect(response.body).toEqual({
				data: {
					liked: true
				},
				status: 'success'
			});
		});
	});

	describe('Cannot like already liked post', () => {
		let response;
		beforeAll(async () => {
			const { token, id } = authDetails;
			const { id: postID } = await postSeeder({
				postBody: 'something',
				createdBy: id
			});
			await likeSeeder({ like: true, postID, user: id });
			response = await request(server).post(`/posts/${postID}/likes`).set('Authorization', `Bearer ${token}`);
		});

		it('returns 400 status code', () => {
			expect(response.status).toBe(400);
		});

		it('returns like status', () => {
			expect(response.body).toEqual({
				data: {
					liked: false
				},
				status: 'error'
			});
		});
	});

	describe('Can unlike a post previously liked', () => {
		let response;
		beforeAll(async () => {
			const { token, id } = authDetails;
			const { id: postID } = await postSeeder({
				postBody: 'something',
				createdBy: id
			});
			await likeSeeder({
				like: true,
				postID,
				user: id
			});
			response = await request(server).delete(`/posts/${postID}/likes`).set('Authorization', `Bearer ${token}`);
		});

		it('returns 200 status code', () => {
			expect(response.status).toBe(200);
		});

		it('returns like status', () => {
			expect(response.body).toEqual({
				data: {
					unliked: true
				},
				status: 'success'
			});
		});
	});

	describe('Cannot unlike post not previously liked', () => {
		let response;
		beforeAll(async () => {
			const { token, id } = authDetails;
			const { id: postID } = await postSeeder({
				postBody: 'something',
				createdBy: id
			});
			await likeSeeder({
				like: false,
				postID,
				user: id
			});
			response = await request(server).delete(`/posts/${postID}/likes`).set('Authorization', `Bearer ${token}`);
		});

		it('returns 400 status code', () => {
			expect(response.status).toBe(400);
		});

		it('returns like status', () => {
			expect(response.body).toEqual({
				data: {
					unliked: false
				},
				status: 'error'
			});
		});
	});
});