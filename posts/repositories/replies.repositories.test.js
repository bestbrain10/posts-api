const ReplyRepository = require('./replies.repository');
const User = require('../../users/models/user.model');

describe('Replies Repository', () => {
	it('Fetches replies with pagination, without createdBy condition if user is null', async () => {
		const replySpy = jest.spyOn(ReplyRepository, 'findAndCountAll').mockResolvedValue({
			rows: [],
			count: 1
		});
		const result = await ReplyRepository.fetchReplies({
			postID: '1234',
			limit: 1,
			offset: 0
		});

		expect(replySpy).toBeCalledWith({
			where: {
				postId: '1234'
			},
			limit: 1,
			offset: 0,
			include: [{
				model: User,
				attributes: ['id', 'fullname'],
				as: 'user'
			}]
		});

		expect(result).toEqual({
			rows: [],
			count: 1
		});
	});

	it('Fetches replies with pagination, with createdBy condition if user is provided', async () => {
		const replySpy = jest.spyOn(ReplyRepository, 'findAndCountAll').mockResolvedValue({
			rows: [],
			count: 1
		});
		const result = await ReplyRepository.fetchReplies({
			user: '1234',
			postID: '1234',
			limit: 1,
			offset: 0
		});

		expect(replySpy).toBeCalledWith({
			where: {
				createdBy: '1234',
				postId: '1234',
			},
			limit: 1,
			offset: 0,
			include: [{
				model: User,
				attributes: ['id', 'fullname'],
				as: 'user'
			}]
		});

		expect(result).toEqual({
			rows: [],
			count: 1
		});
	});

	it('can fetch reply by ID', async () => {
		const replySpy = jest.spyOn(ReplyRepository, 'findByPk').mockResolvedValueOnce({
			replyBody: 'hello'
		});

		const result = await ReplyRepository.fetchReply('456');
		expect(result).toEqual({
			replyBody: 'hello'
		});
		expect(replySpy).toBeCalledWith('456', {
			include: [{
				model: User,
				attributes: ['id', 'fullname'],
				as: 'user'
			}]
		});
	});
});