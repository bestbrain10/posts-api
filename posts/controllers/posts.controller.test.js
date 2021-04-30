
require('dotenv').config();

const { mockNext, mockRequest, mockResponse } = require('../../__mocks__/http');
const PostsController = require('./posts.controller');
const Post = require('../models/post.model');
const joiValidator = require('../../common/utils/joi-validator');

describe('Posts Controller', () => {
	it('posts schema fails with invalid payload', async () => {
		const payload = {  };

		try {
			await joiValidator.validate(payload, PostsController.postSchema);
		}catch(e) {
			expect(e).toEqual({
				post_body: 'post_body is required'
			});
		}
	});

	it('posts schema passes with valid payload', async () => {
		const payload = {
			post_body: 'post_body is required'
		};

		const result = await joiValidator.validate(payload, PostsController.postSchema);
		expect(result).toEqual(payload);
	});


	it('Logged in user can create a post', async () => {
		const req = mockRequest({
			body: {
				post_body: 'post_body is required'
			},
			user: {
				id: '1234'
			}
		});

		const res = mockResponse();

		const postSpy = jest.spyOn(Post, 'create').mockResolvedValueOnce({ 
			postBody: 'post_body is required',
			createdBy: '1234'
		});

		await PostsController.create(req, res, mockNext);

		expect(postSpy).toBeCalledWith({
			postBody: 'post_body is required',
			createdBy: '1234'
		});

		expect(res.status).toBeCalledWith(201);
		expect(res.data).toBeCalledWith({
			postBody: 'post_body is required',
			createdBy: '1234'
		});
	});

	it('Can fetch a single post', async () => {
		const req = mockRequest({
			params: { post: '1234' }
		});

		const res = mockResponse();

		const postSpy = jest.spyOn(Post, 'fetchPost').mockResolvedValueOnce({
			id: '1234',
			postBody: 'post_body is required',
			createdBy: '1234'
		});

		await PostsController.getOnePost(req, res, mockNext);

		expect(postSpy).toBeCalledWith('1234');

		expect(res.data).toBeCalledWith({
			id: '1234',
			postBody: 'post_body is required',
			createdBy: '1234'
		});
	});

	it('Can fetch all posts using default pagination', async () => {
		const req = mockRequest({});

		const res = mockResponse();

		const postSpy = jest.spyOn(Post, 'fetchPosts').mockResolvedValueOnce([{
			id: '1234',
			postBody: 'post_body is required',
			createdBy: '1234'
		}]);

		await PostsController.getAllPosts(req, res, mockNext);

		expect(postSpy).toBeCalledWith({ limit: 30, offset: 0, user: null });

		expect(res.data).toBeCalledWith([{
			id: '1234',
			postBody: 'post_body is required',
			createdBy: '1234'
		}]);
	});

	it('can fetch all posts using query params for pagination', async () => {
		const req = mockRequest({
			query: {
				limit: 100,
				offset: 10,
				user: '1234'
			}
		});

		const res = mockResponse();

		const postSpy = jest.spyOn(Post, 'fetchPosts').mockResolvedValueOnce([{
			id: '1234',
			postBody: 'post_body is required',
			createdBy: '1234'
		}]);

		await PostsController.getAllPosts(req, res, mockNext);

		expect(postSpy).toBeCalledWith({
			limit: 100,
			offset: 10,
			user: '1234'
		});

		expect(res.data).toBeCalledWith([{
			id: '1234',
			postBody: 'post_body is required',
			createdBy: '1234'
		}]);
	});

	it('Can update own post', async () => {
		const req = mockRequest({
			body: {
				post_body: 'post_body is required'
			},
			user: {
				id: '1234'
			}
		});

		const res = mockResponse();

		const postSpy = jest.spyOn(Post, 'create').mockResolvedValueOnce({
			postBody: 'post_body is required',
			createdBy: '1234'
		});

		await PostsController.create(req, res, mockNext);

		expect(postSpy).toBeCalledWith({
			postBody: 'post_body is required',
			createdBy: '1234'
		});

		expect(res.status).toBeCalledWith(201);
		expect(res.data).toBeCalledWith({
			postBody: 'post_body is required',
			createdBy: '1234'
		});
	});

	it('Can delete own post', async () => {
		const req = mockRequest({
			params: {
				post: '1234'
			},
			user: { id: '1234' }
		});

		const res = mockResponse();

		const postSpy = jest.spyOn(Post, 'deletePost').mockResolvedValueOnce(true);

		await PostsController.deletePost(req, res, mockNext);

		expect(postSpy).toBeCalledWith({
			postID: '1234',
			user: '1234'
		});

		expect(res.data).toBeCalledWith({ deleted: true });
	});
});