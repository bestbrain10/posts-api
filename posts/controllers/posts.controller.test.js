

const { mockNext, mockRequest, mockResponse } = require('../../__mocks__/http');
const PostsController = require('./posts.controller');
// const Post = require('../models/post.model');
const PostRepository = require('../repositories/posts.repository');
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

		const postSpy = jest.spyOn(PostRepository, 'create').mockResolvedValueOnce({
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

	it('appends file to body during when creating post, if file is present', async () => {
		const req = mockRequest({
			body: {
				post_body: 'post_body is required'
			},
			user: {
				id: '1234'
			},
			file: {
				filename: 'file-path' ,
			}
		});

		const res = mockResponse();

		const postSpy = jest.spyOn(PostRepository, 'create').mockResolvedValueOnce({
			postBody: 'post_body is required',
			createdBy: '1234'
		});

		await PostsController.create(req, res, mockNext);

		expect(postSpy).toBeCalledWith({
			media: 'file-path',
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

		const postSpy = jest.spyOn(PostRepository, 'fetchPost').mockResolvedValueOnce({
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

		const postSpy = jest.spyOn(PostRepository, 'fetchPosts').mockResolvedValueOnce([{
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

		const postSpy = jest.spyOn(PostRepository, 'fetchPosts').mockResolvedValueOnce([{
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
			params: {
				post: '1234'
			},
			body: {
				post_body: 'post_body is required'
			},
			user: {
				id: '1234'
			}
		});

		const res = mockResponse();

		const postSpy = jest.spyOn(PostRepository, 'edit').mockResolvedValueOnce(true);

		await PostsController.updatePost(req, res, mockNext);

		expect(postSpy).toBeCalledWith({
			post: '1234',
			postBody: 'post_body is required',
			user: '1234'
		});

		expect(res.status).toBeCalledWith(200);
		expect(res.data).toBeCalledWith({ updated: true }, 'success');
	});

	it('appends file to body during when updating post, if file is present', async () => {
		const req = mockRequest({
			params: {
				post: '1234'
			},
			body: {
				post_body: 'post_body is required'
			},
			user: {
				id: '1234'
			},
			file: {
				filename: 'updated-pic'
			}
		});

		const res = mockResponse();

		const postSpy = jest.spyOn(PostRepository, 'edit').mockResolvedValueOnce(true);

		await PostsController.updatePost(req, res, mockNext);

		expect(postSpy).toBeCalledWith({
			post: '1234',
			media: 'updated-pic',
			postBody: 'post_body is required',
			user: '1234'
		});

		expect(res.status).toBeCalledWith(200);
		expect(res.data).toBeCalledWith({ updated: true }, 'success');
	});

	it('Cannot update another user post', async () => {
		const req = mockRequest({
			params: {
				post: '1234'
			},
			body: {
				post_body: 'post_body is required'
			},
			user: {
				id: '1234'
			}
		});

		const res = mockResponse();

		const postSpy = jest.spyOn(PostRepository, 'edit').mockResolvedValueOnce(false);

		await PostsController.updatePost(req, res, mockNext);

		expect(postSpy).toBeCalledWith({
			post: '1234',
			postBody: 'post_body is required',
			user: '1234'
		});

		expect(res.status).toBeCalledWith(400);
		expect(res.data).toBeCalledWith({ updated: false }, 'error');
	});

	it('Can delete own post', async () => {
		const req = mockRequest({
			params: {
				post: '1234'
			},
			user: { id: '1234' }
		});

		const res = mockResponse();

		const postSpy = jest.spyOn(PostRepository, 'deletePost').mockResolvedValueOnce(true);

		await PostsController.deletePost(req, res, mockNext);

		expect(postSpy).toBeCalledWith({
			postID: '1234',
			user: '1234'
		});
		expect(res.status).toBeCalledWith(200);

		expect(res.data).toBeCalledWith({ deleted: true }, 'success');
	});

	it('Cannot delete another user\'s post', async () => {
		const req = mockRequest({
			params: {
				post: '1234'
			},
			user: {
				id: '1234'
			}
		});

		const res = mockResponse();

		const postSpy = jest.spyOn(PostRepository, 'deletePost').mockResolvedValueOnce(false);

		await PostsController.deletePost(req, res, mockNext);

		expect(postSpy).toBeCalledWith({
			postID: '1234',
			user: '1234'
		});

		expect(res.status).toBeCalledWith(400);
		expect(res.data).toBeCalledWith({
			deleted: false
		}, 'error');
	});


	it('PostExists middleware does not proceeds to next route if post does not exists', async () => {
		const req = mockRequest({
			params: {
				post: '1234'
			},
		});

		const res = mockResponse();

		const postSpy = jest.spyOn(PostRepository, 'exists').mockResolvedValueOnce(false);

		await PostsController.postExists(req, res, mockNext);

		expect(postSpy).toBeCalledWith('1234');

		expect(res.status).toBeCalledWith(404);
		expect(res.error).toBeCalledWith({
			post: 'post does not exist'
		});
	});

	it('PostExists middleware proceeds to next route if post exists', async () => {
		const req = mockRequest({
			params: {
				post: '1234'
			},
		});

		const res = mockResponse();
		const next = jest.fn();

		const postSpy = jest.spyOn(PostRepository, 'exists').mockResolvedValueOnce(true);

		await PostsController.postExists(req, res, next);

		expect(postSpy).toBeCalledWith('1234');

		expect(next).toBeCalled();
	});

});