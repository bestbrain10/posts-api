const { mockNext, mockRequest, mockResponse } = require('../../__mocks__/http');
const RepliesController = require('./replies.controller');
const ReplyRepository = require('../repositories/replies.repository');
const joiValidator = require('../../common/utils/joi-validator');

describe('Posts Controller', () => {
	it('reply schema fails with invalid payload', async () => {
		const payload = {};

		try {
			await joiValidator.validate(payload, RepliesController.replySchema);
		} catch (e) {
			expect(e).toEqual({
				reply_body: 'reply_body is required'
			});
		}
	});

	it('reply schema passes with valid payload', async () => {
		const payload = {
			reply_body: 'reply_body is required'
		};

		const result = await joiValidator.validate(payload, RepliesController.replySchema);
		expect(result).toEqual(payload);
	});


	it('Logged in user can create a post', async () => {
		const req = mockRequest({
			params: {
				post: '789'
			},
			body: {
				reply_body: 'reply_body is required'
			},
			user: {
				id: '1234'
			}
		});

		const res = mockResponse();

		const replySpy = jest.spyOn(ReplyRepository, 'create').mockResolvedValueOnce({
			replyBody: 'reply_body is required',
			createdBy: '1234'
		});

		await RepliesController.createReply(req, res, mockNext);

		expect(replySpy).toBeCalledWith({
			postId: '789',
			replyBody: 'reply_body is required',
			createdBy: '1234'
		});

		expect(res.status).toBeCalledWith(201);
		expect(res.data).toBeCalledWith({
			replyBody: 'reply_body is required',
			createdBy: '1234'
		});
	});

	it('Can fetch a single reply', async () => {
		const req = mockRequest({
			params: {
				reply: '1234'
			}
		});

		const res = mockResponse();

		const replySpy = jest.spyOn(ReplyRepository, 'fetchReply').mockResolvedValueOnce({
			id: '1234',
			replyBody: 'reply_body is required',
			createdBy: '1234'
		});

		await RepliesController.getOneReply(req, res, mockNext);

		expect(replySpy).toBeCalledWith('1234');

		expect(res.data).toBeCalledWith({
			id: '1234',
			replyBody: 'reply_body is required',
			createdBy: '1234'
		});
	});

	it('Can fetch all posts using default pagination', async () => {
		const req = mockRequest({
			params: { post: '12345' }
		});

		const res = mockResponse();

		const replySpy = jest.spyOn(ReplyRepository, 'fetchReplies').mockResolvedValueOnce([{
			id: '1234',
			replyBody: 'reply_body is required',
			createdBy: '1234'
		}]);

		await RepliesController.getAllReplies(req, res, mockNext);

		expect(replySpy).toBeCalledWith({
			postID: '12345',
			limit: 30,
			offset: 0,
			user: null
		});

		expect(res.data).toBeCalledWith([{
			id: '1234',
			replyBody: 'reply_body is required',
			createdBy: '1234'
		}]);
	});

	it('can fetch all posts using query params for pagination', async () => {
		const req = mockRequest({
			params: { post: '12345' },
			query: {
				limit: 100,
				offset: 10,
				user: '1234'
			}
		});

		const res = mockResponse();

		const replySpy = jest.spyOn(ReplyRepository, 'fetchReplies').mockResolvedValueOnce([{
			id: '1234',
			replyBody: 'reply_body is required',
			createdBy: '1234'
		}]);

		await RepliesController.getAllReplies(req, res, mockNext);

		expect(replySpy).toBeCalledWith({
			limit: 100,
			offset: 10,
			user: '1234',
			postID: '12345'
		});

		expect(res.data).toBeCalledWith([{
			id: '1234',
			replyBody: 'reply_body is required',
			createdBy: '1234'
		}]);
	});

	it('Can update own post reply', async () => {
		const req = mockRequest({
			params: {
				post: '1234',
				reply: '7890'
			},
			body: {
				reply_body: 'reply_body is required'
			},
			user: {
				id: '1234'
			}
		});

		const res = mockResponse();

		const replySpy = jest.spyOn(ReplyRepository, 'edit').mockResolvedValueOnce(true);

		await RepliesController.updateReply(req, res, mockNext);

		expect(replySpy).toBeCalledWith({
			replyID: '7890',
			postID: '1234',
			replyBody: 'reply_body is required',
			user: '1234'
		});

		expect(res.status).toBeCalledWith(200);
		expect(res.data).toBeCalledWith({
			updated: true
		}, 'success');
	});

	it('Cannot update another user post', async () => {
		const req = mockRequest({
			params: {
				post: '1234',
				reply: '7890'
			},
			body: {
				reply_body: 'reply_body is required'
			},
			user: {
				id: '1234'
			}
		});

		const res = mockResponse();

		const replySpy = jest.spyOn(ReplyRepository, 'edit').mockResolvedValueOnce(false);

		await RepliesController.updateReply(req, res, mockNext);

		expect(replySpy).toBeCalledWith({
			replyID: '7890',
			postID: '1234',
			replyBody: 'reply_body is required',
			user: '1234'
		});

		expect(res.status).toBeCalledWith(400);
		expect(res.data).toBeCalledWith({
			updated: false
		}, 'error');
	});

	it('Can delete own Reply', async () => {
		const req = mockRequest({
			params: {
				post: '1234',
				reply: '6789'
			},
			user: {
				id: '1234'
			}
		});

		const res = mockResponse();

		const replySpy = jest.spyOn(ReplyRepository, 'deleteReply').mockResolvedValueOnce(true);

		await RepliesController.deleteReply(req, res, mockNext);

		expect(replySpy).toBeCalledWith({
			replyID: '6789',
			postID: '1234',
			user: '1234'
		});
		expect(res.status).toBeCalledWith(200);

		expect(res.data).toBeCalledWith({
			deleted: true
		}, 'success');
	});

	it('Cannot delete another user\'s post', async () => {
		const req = mockRequest({
			params: {
				post: '1234',
				replyID: '6789'
			},
			user: {
				id: '1234'
			}
		});

		const res = mockResponse();

		const postSpy = jest.spyOn(ReplyRepository, 'deleteReply').mockResolvedValueOnce(false);

		await RepliesController.deleteReply(req, res, mockNext);

		expect(postSpy).toBeCalledWith({
			postID: '1234',
			replyID: '6789',
			user: '1234'
		});

		expect(res.status).toBeCalledWith(400);
		expect(res.data).toBeCalledWith({
			deleted: false
		}, 'error');
	});

});