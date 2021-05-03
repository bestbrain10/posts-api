const PostsRepository = require('./posts.repository');
const User = require('../../users/models/user.model');


describe('Posts Repository', () => {
	it('Fetches posts with pagination, without createdBy condition if user is null', async () => {
		const postSpy = jest.spyOn(PostsRepository, 'findAndCountAll').mockResolvedValue({
			rows: [],
			count: 1
		});
		const result = await PostsRepository.fetchPosts({
			limit: 1,
			offset: 0
		});

		expect(postSpy).toBeCalledWith({
			limit: 1,
			offset: 0,
			order: [
				['createdAt', 'DESC']
			],
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

	it('Fetches posts with pagination, with createdBy condition if user is provided', async () => {
		const postSpy = jest.spyOn(PostsRepository, 'findAndCountAll').mockResolvedValue({
			rows: [],
			count: 1
		});
		const result = await PostsRepository.fetchPosts({
			user: '1234',
			limit: 1,
			offset: 0
		});

		expect(postSpy).toBeCalledWith({
			where: {
				createdBy: '1234'
			},
			limit: 1,
			offset: 0,
			order: [
				['createdAt', 'DESC']
			],
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

	it('can fetch post by ID', async () => {
		const postSpy = jest.spyOn(PostsRepository, 'findByPk').mockResolvedValueOnce({
			postBody: 'hello'
		});

		const result = await PostsRepository.fetchPost('456');
		expect(result).toEqual({
			postBody: 'hello'
		});
		expect(postSpy).toBeCalledWith('456', {
			include: [{
				model: User,
				attributes: ['id', 'fullname'],
				as: 'user'
			}]
		});
	});
});