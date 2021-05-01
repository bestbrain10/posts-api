
const Post = require('./post.model');

describe('Post Model', () => {
	it('Adds edited: true when updating a post', async () => {
		const postSpy = jest.spyOn(Post, 'update').mockResolvedValue([1]);
		const args = { post: '123', postBody: 'new body',  user: '123' };
		const result = await Post.edit(args);

		expect(postSpy).toBeCalledWith({
			postBody: args.postBody,
			edited: true
		}, {
			where: {
				id: args.post,
				createdBy: args.user
			}
		});
		expect(result).toEqual(true);
	});

	it('Fetches posts with pagination, without createdBy condition if user is null', async () => {
		const postSpy = jest.spyOn(Post, 'findAndCountAll').mockResolvedValue({ rows: [], count: 1 });
		const result = await Post.fetchPosts({ limit: 1, offset: 0});

		expect(postSpy).toBeCalledWith({
			limit: 1,
			offset: 0
		});

		expect(result).toEqual({
			rows: [],
			count: 1
		});
	});

	it('Fetches posts with pagination, with createdBy condition if user is provided', async () => {
		const postSpy = jest.spyOn(Post, 'findAndCountAll').mockResolvedValue({
			rows: [],
			count: 1
		});
		const result = await Post.fetchPosts({
			user: '1234',
			limit: 1,
			offset: 0
		});

		expect(postSpy).toBeCalledWith({
			where: {
				createdBy: '1234'
			},
			limit: 1,
			offset: 0
		});

		expect(result).toEqual({
			rows: [],
			count: 1
		});
	});

	it('deletes post', async () => {
		const postSpy = jest.spyOn(Post, 'destroy').mockResolvedValueOnce(3);

		const result = await Post.deletePost({ user: '123', postID: '456' });

		expect(result).toEqual(true);
		expect(postSpy).toBeCalledWith({
			where: {
				createdBy: '123',
				id: '456'
			}
		});
	});

	it('checks if post exists', async () => {
		const postSpy = jest.spyOn(Post, 'count').mockResolvedValueOnce(3);

		const result = await Post.exists('456');

		expect(result).toEqual(true);
		expect(postSpy).toBeCalledWith({
			where: {
				id: '456'
			}
		});
	});

	it('can fetch post by ID', async () => {
		const postSpy = jest.spyOn(Post, 'findByPk').mockResolvedValueOnce({ postBody: 'hello' });

		const result = await Post.fetchPost('456');
		expect(result).toEqual({
			postBody: 'hello'
		});
		expect(postSpy).toBeCalledWith('456');
	});
});