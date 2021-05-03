require('dotenv').config();
process.env.NODE_ENV = 'test';

const request = require('supertest');
const server = require('../../server');
const database = require('../../database');
const userSeeder = require('../../__mocks__/user');
const postSeeder = require('../../__mocks__/post');
const _ = require('lodash');
const { v4: uuid } = require('uuid');
const postProperties = ['edited', 'user' , 'media', 'mediaLink', 'postBody', 'id', 'createdBy', 'createdAt', 'updatedAt'];
const nonCreateProperties = ['user'];

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
			expect(response.status).toBe(201);
		});

		it('returns post details', () => {
			expect(Object.keys(response.body.data).sort())
				.toEqual(postProperties.filter(prop => !nonCreateProperties.includes(prop)).sort());
		});
	});

	describe('Only images can be uploaded when creating post', () => {
		let response;
		beforeAll(async () => {
			const { token } = authDetails;
			response = await request(server).post('/posts').field({
				post_body: 'something'
			}).attach('media', '__mocks__/http.js').set('Authorization', `Bearer ${token}`);
		});

		it('returns 400 status code', () => {
			expect(response.status).toBe(400);
		});

		it('returns error message', () => {
			expect(response.body).toEqual({
				message: 'media only supports image file upload',
				status: 'error'
			});
		});
	});

	describe('Can create post with image', () => {
		let response;
		beforeAll(async () => {
			const { token } = authDetails;
			response = await request(server).post('/posts').field({
				post_body: 'something'
			}).attach('media', '__mocks__/ironman.jpg').set('Authorization', `Bearer ${token}`);
		});

		it('returns 201 status code', () => {
			expect(response.status).toBe(201);
		});

		it('returns post details', () => {
			expect(Object.keys(response.body.data).sort())
				.toEqual(postProperties.filter(prop => !nonCreateProperties.includes(prop)).sort().sort());
		});
	});

	describe('Can edit own post', () => {
		let response;
		beforeAll(async () => {
			const { token, id } = authDetails;
			const { id: postID } = await postSeeder({ postBody: 'something', createdBy: id });
			response = await request(server).put(`/posts/${postID}`).send({
				post_body: 'something'
			}).set('Authorization', `Bearer ${token}`);
		});

		it('returns 200 status code', () => {
			expect(response.status).toBe(200);
		});

		it('returns post details', () => {
			expect(response.body).toEqual({
				data: { updated: true },
				status: 'success'
			});
		});
	});

	describe('Can edit own post with image', () => {
		let response;
		beforeAll(async () => {
			const { token, id } = authDetails;
			const { id: postID } = await postSeeder({ postBody: 'something', createdBy: id });
			response = await request(server).put(`/posts/${postID}`).field({
				post_body: 'something'
			}).attach('media', '__mocks__/ironman.jpg').set('Authorization', `Bearer ${token}`);
		});

		it('returns 200 status code', () => {
			expect(response.status).toBe(200);
		});

		it('returns post details', () => {
			expect(response.body).toEqual({
				data: { updated: true },
				status: 'success'
			});
		});
	});

	describe('Cannot edit another user\'s post', () => {
		let response;
		beforeAll(async () => {
			const { token } = authDetails;
			const { id } = await userSeeder(); 
			const { id: postID } = await postSeeder({
				postBody: 'something',
				createdBy: id
			});
			response = await request(server).put(`/posts/${postID}`).send({
				post_body: 'something'
			}).set('Authorization', `Bearer ${token}`);
		});

		it('returns 400 status code', () => {
			expect(response.status).toBe(400);
		});

		it('returns error message', () => {
			expect(response.body).toEqual({
				data: {
					updated: false
				},
				status: 'error'
			});
		});
	});

	describe('Can delete post', () => {
		let response;
		beforeAll(async () => {
			const { token, id } = authDetails;
			const { id: postID } = await postSeeder({
				postBody: 'something',
				createdBy: id
			});
			response = await request(server).delete(`/posts/${postID}`).set('Authorization', `Bearer ${token}`);
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

	describe('Can delete another user\'s post', () => {
		let response;
		beforeAll(async () => {
			const { token } = authDetails;
			const { id } = await userSeeder();
			const { id: postID } = await postSeeder({
				postBody: 'something',
				createdBy: id
			});
			response = await request(server).delete(`/posts/${postID}`).set('Authorization', `Bearer ${token}`);
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

	describe('Can fetch a post by ID', () => {
		let response;
		let post;
		beforeAll(async () => {
			const { token, id } = authDetails;
			const { id: postID,  } = post = await postSeeder({
				postBody: 'something',
				createdBy: id
			});
			response = await request(server).get(`/posts/${postID}`).set('Authorization', `Bearer ${token}`);
		});

		it('returns 200 status code', () => {
			expect(response.status).toBe(200);
		});

		it('returns post details', () => {
			expect(response.body).toMatchObject({
				data: {
					...post.toJSON(),
					createdAt: post.createdAt.toJSON(),
					updatedAt: post.updatedAt.toJSON()
				},
				status: 'success'
			});
		});
	});

	describe('Can fetch all post', () => {
		let response;
		beforeAll(async () => {
			const { token, id } = authDetails;
			await postSeeder([{
				postBody: 'something',
				createdBy: id
			}, {
				postBody: 'Domamu I have come to bargain',
				createdBy: id
			}, {
				postBody: 'I am inevitable',
				createdBy: id
			}]);
			response = await request(server).get('/posts?limit=5').set('Authorization', `Bearer ${token}`);
		});

		it('returns 200 status code', () => {
			expect(response.status).toBe(200);
		});

		it('returns post array less than or equal to pagination limit', () => {
			expect(response.body.data).toHaveProperty('rows');
			expect(response.body.data.rows).toBeInstanceOf(Array);
			expect(response.body.data.rows.length).toBeLessThanOrEqual(5);
		});

		it('returns post details', () => {
			const expectedKeys = postProperties.sort();
			
			expect(response.body.data.rows.every(post => {
				return !_.difference(Object.keys(post).sort(), expectedKeys).length;
			}))
				.toEqual(true);
		});
	});

	describe('Can fetch only a user\'s post', () => {
		let response;
		let user;
		beforeAll(async () => {
			const { id } = user = await userSeeder();
			await postSeeder([{
				postBody: 'something',
				createdBy: id
			}, {
				postBody: 'Domamu I have come to bargain',
				createdBy: id
			}, {
				postBody: 'I am inevitable',
				createdBy: id
			}]);
			response = await request(server).get(`/posts?limit=5&user=${id}`).set('Authorization', `Bearer ${authDetails.token}`);
		});

		it('returns 200 status code', () => {
			expect(response.status).toBe(200);
		});

		it('returns post array less than or equal to pagination limit', () => {
			expect(response.body.data).toHaveProperty('rows');
			expect(response.body.data.rows).toBeInstanceOf(Array);
			expect(response.body.data.rows.length).toBeLessThanOrEqual(5);
		});

		it('return all post belongs to a user', () => {
			expect(response.body.data.rows.every(post => {
				return post.createdBy === user.id;
			}))
				.toEqual(true);
		});

		it('returns post details', () => {
			const expectedKeys = postProperties.sort();

			expect(response.body.data.rows.every(post => {
				return !_.difference(Object.keys(post).sort(), expectedKeys).length;
			}))
				.toEqual(true);
		});
	});
});
