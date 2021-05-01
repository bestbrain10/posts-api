const LikesController = require('./likes.controller');
const Like = require('../models/like.model');
const { mockNext, mockRequest, mockResponse } = require('../../__mocks__/http');

describe('Like Controller', () => {
	it('Unliking a post unsuccessfully returns unliked: false', async () => {
		const req = mockRequest({
			params: {
				post: '1234'
			},
			user: {
				id: '1234'
			}
		});

		const res = mockResponse();

		const unlikeSpy = jest.spyOn(Like, 'unlikePost').mockResolvedValueOnce(false);

		await LikesController.unlikePost(req, res, mockNext);

		expect(unlikeSpy).toBeCalledWith({
			postID: '1234',
			user: '1234'
		});

		expect(res.status).toBeCalledWith(400);
		expect(res.data).toBeCalledWith({ unliked: false }, 'error');
	});

	it('Unliking a post successfully returns unliked: true', async () => {
		const req = mockRequest({
			params: {
				post: '1234'
			},
			user: {
				id: '1234'
			}
		});

		const res = mockResponse();

		const unlikeSpy = jest.spyOn(Like, 'unlikePost').mockResolvedValueOnce(true);

		await LikesController.unlikePost(req, res, mockNext);

		expect(unlikeSpy).toBeCalledWith({
			postID: '1234',
			user: '1234'
		});

		expect(res.status).toBeCalledWith(200);
		expect(res.data).toBeCalledWith({ unliked: true }, 'success');
	});

	it('Liking a post unsuccessfully returns liked: false', async () => {
		const req = mockRequest({
			params: {
				post: '1234'
			},
			user: {
				id: '1234'
			}
		});

		const res = mockResponse();

		const likeSpy = jest.spyOn(Like, 'likePost').mockResolvedValueOnce(false);

		await LikesController.likePost(req, res, mockNext);

		expect(likeSpy).toBeCalledWith({
			postID: '1234',
			user: '1234'
		});

		expect(res.status).toBeCalledWith(400);
		expect(res.data).toBeCalledWith({ liked: false }, 'error');
	});

	it('Liking a post successfully returns liked: true', async () => {
		const req = mockRequest({
			params: {
				post: '1234'
			},
			user: {
				id: '1234'
			}
		});

		const res = mockResponse();

		const likeSpy = jest.spyOn(Like, 'likePost').mockResolvedValueOnce(true);

		await LikesController.likePost(req, res, mockNext);

		expect(likeSpy).toBeCalledWith({
			postID: '1234',
			user: '1234'
		});

		expect(res.status).toBeCalledWith(200);
		expect(res.data).toBeCalledWith({ liked: true }, 'success');
	});
});