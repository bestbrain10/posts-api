
require('dotenv').config();
process.env.NODE_ENV = 'test';

const request = require('supertest');
const server = require('../../server');
const database = require('../../database');
const userSeeder = require('../../__mocks__/user');
const postSeeder = require('../../__mocks__/post');
const replySeeder = require('../../__mocks__/reply');
const _ = require('lodash');
const { v4: uuid } = require('uuid');

const email = `steve${uuid()}@avengers.com`;
const replyProps = ['edited', 'user', 'replyBody', 'postId', 'id', 'createdBy', 'createdAt', 'updatedAt'];

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

	describe('Cannot reply a non-existing post', () => {
		let response;
		beforeAll(async () => {
			const { token } = authDetails;
			const postID = uuid();
			response = await request(server).post(`/posts/${postID}/replies`).send({}).set('Authorization', `Bearer ${token}`);
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

	describe('Can create reply', () => {
		let response;
		beforeAll(async () => {
			const { token, id } = authDetails;
			const { id: postID } = await postSeeder({
				postBody: 'something',
				createdBy: id
			});
			response = await request(server).post(`/posts/${postID}/replies`).send({
				reply_body: 'something'
			}).set('Authorization', `Bearer ${token}`);
		});

		it('returns 201 status code', () => {
			expect(response.status).toBe(201);
		});

		it('returns post details', () => {
			expect(Object.keys(response.body.data).sort())
				.toEqual(replyProps.filter(prop => !['user'].includes(prop)).sort());
		});
	});

	describe('Can edit own post reply', () => {
		let response;
		beforeAll(async () => {
			const { token, id } = authDetails;
			const { id: postID } = await postSeeder({
				postBody: 'something',
				createdBy: id
			});
			const { id: replyID } = await replySeeder({
				replyBody: '...I am inevitable',
				createdBy: id,
				postId: postID
			});

			response = await request(server).put(`/posts/${postID}/replies/${replyID}`).send({
				reply_body: '...and I, am, Iron man'
			}).set('Authorization', `Bearer ${token}`);
		});

		it('returns 200 status code', () => {
			expect(response.status).toBe(200);
		});

		it('returns post details', () => {
			expect(response.body).toEqual({
				data: {
					updated: true
				},
				status: 'success'
			});
		});
	});

	describe('Cannot edit another user\'s post reply', () => {
		let response;
		beforeAll(async () => {
			const { token } = authDetails;
			const { id } = await userSeeder();
			const { id: postID } = await postSeeder({
				postBody: 'something',
				createdBy: id
			});
			const { id: replyID } = await replySeeder({
				replyBody: '...I am inevitable',
				createdBy: id,
				postId: postID
			});
			response = await request(server).put(`/posts/${postID}/replies/${replyID}`).send({
				reply_body: '...we have the hulk'
			}).set('Authorization', `Bearer ${token}`);
		});

		it('returns 400 status code', () => {
			expect(response.status).toBe(400);
		});

		it('returns post details', () => {
			expect(response.body).toEqual({
				data: {
					updated: false
				},
				status: 'error'
			});
		});
	});

	describe('Can delete post reply', () => {
		let response;
		beforeAll(async () => {
			const { token, id } = authDetails;
			const { id: postID } = await postSeeder({
				postBody: 'something',
				createdBy: id
			});
			const { id: replyID } = await replySeeder({
				replyBody: '...I am inevitable',
				createdBy: id,
				postId: postID
			});
			response = await request(server).delete(`/posts/${postID}/replies/${replyID}`).set('Authorization', `Bearer ${token}`);
		});

		it('returns 200 status code', () => {
			expect(response.status).toBe(200);
		});

		it('returns delete status', () => {
			expect(response.body).toEqual({
				data: {
					deleted: true
				},
				status: 'success'
			});
		});
	});

	describe('Can delete another user\'s post reply', () => {
		let response;
		beforeAll(async () => {
			const { token } = authDetails;
			const { id } = await userSeeder();
			const { id: postID } = await postSeeder({
				postBody: 'something',
				createdBy: id
			});
			const { id: replyID } = await replySeeder({
				replyBody: '...I am inevitable',
				createdBy: id,
				postId: postID
			});
			response = await request(server).delete(`/posts/${postID}/replies/${replyID}`).set('Authorization', `Bearer ${token}`);
		});

		it('returns 400 status code', () => {
			expect(response.status).toBe(400);
		});

		it('returns delete status', () => {
			expect(response.body).toEqual({
				data: {
					deleted: false
				},
				status: 'error'
			});
		});
	});

	describe('Can fetch a post reply by ID', () => {
		let response;
		let reply;
		beforeAll(async () => {
			const { token, id } = authDetails;
			const { id: postID, } = await postSeeder({
				postBody: 'something',
				createdBy: id
			});
			const { id: replyID } = reply = await replySeeder({
				replyBody: '...I am inevitable',
				createdBy: id,
				postId: postID
			});
			response = await request(server).get(`/posts/${postID}/replies/${replyID}`).set('Authorization', `Bearer ${token}`);
		});

		it('returns 200 status code', () => {
			expect(response.status).toBe(200);
		});

		it('returns post details', () => {
			expect(response.body).toMatchObject({
				data: {
					...reply.toJSON(),
					createdAt: reply.createdAt.toJSON(),
					updatedAt: reply.updatedAt.toJSON()
				},
				status: 'success'
			});
		});
	});

	describe('Can fetch all post replies', () => {
		let response;
		beforeAll(async () => {
			const { token, id } = authDetails;
			const { id: postID, } = await postSeeder({
				postBody: 'something',
				createdBy: id
			});
			await replySeeder([{
				replyBody: 'something',
				postId: postID,
				createdBy: id
			}, {
				replyBody: 'Domamu I have come to bargain',
				postId: postID,
				createdBy: id
			}, {
				replyBody: 'I am inevitable',
				postId: postID,
				createdBy: id
			}]);
			response = await request(server).get(`/posts/${postID}/replies?limit=5`).set('Authorization', `Bearer ${token}`);
		});

		it('returns 200 status code', () => {
			expect(response.status).toBe(200);
		});

		it('returns post reply array less than or equal to pagination limit', () => {
			expect(response.body.data).toHaveProperty('rows');
			expect(response.body.data.rows).toBeInstanceOf(Array);
			expect(response.body.data.rows.length).toBeLessThanOrEqual(5);
		});

		it('returns post reply details', () => {

			expect(response.body.data.rows.every(post => {
				return !_.difference(Object.keys(post).sort(), replyProps.sort()).length;
			}))
				.toEqual(true);
		});
	});

	describe('Can fetch only a user\'s post replies', () => {
		let response;
		let user;
		beforeAll(async () => {
			const { id } = user = await userSeeder();
			const { id: postID, } = await postSeeder({
				postBody: 'something',
				createdBy: id
			});
			await replySeeder([{
				replyBody: 'something',
				postId: postID,
				createdBy: id
			}, {
				replyBody: 'Domamu I have come to bargain',
				postId: postID,
				createdBy: id
			}, {
				replyBody: 'I am inevitable',
				postId: postID,
				createdBy: id
			}]);
			response = await request(server).get(`/posts/${postID}/replies?limit=5&user=${id}`).set('Authorization', `Bearer ${authDetails.token}`);
		});

		it('returns 200 status code', () => {
			expect(response.status).toBe(200);
		});

		it('returns post replies array less than or equal to pagination limit', () => {
			expect(response.body.data).toHaveProperty('rows');
			expect(response.body.data.rows).toBeInstanceOf(Array);
			expect(response.body.data.rows.length).toBeLessThanOrEqual(5);
		});

		it('return all post replies belongs to a user', () => {
			expect(response.body.data.rows.every(reply => {
				return reply.createdBy === user.id;
			}))
				.toEqual(true);
		});

		it('returns post replies details', () => {
			expect(response.body.data.rows.every(reply => {
				return !_.difference(Object.keys(reply).sort(), replyProps.sort()).length;
			}))
				.toEqual(true);
		});
	});

});