
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

	
});