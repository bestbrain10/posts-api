const Like = require('./like.model');

describe('Like Model', () => {
	it('Can like a post', async () => {
		const likeSpy = jest.spyOn(Like, 'findOrCreate').mockResolvedValueOnce([1,true]);
		const user = '1234';
		const postID = '1234';

		const result = await Like.likePost({ user, postID });

		expect(likeSpy).toBeCalledWith({
			where: { likedBy: user, postId: postID },
			defaults: { likedBy: user, postId: postID }
		});

		expect(result).toEqual(true);
	});

	it('Can unlike a post', async () => {
		const likeSpy = jest.spyOn(Like, 'destroy').mockResolvedValueOnce(true);
		const user = '1234';
		const postID = '1234';

		const result = await Like.unlikePost({
			user,
			postID
		});

		expect(likeSpy).toBeCalledWith({
			where: {
				likedBy: user,
				postId: postID
			},
		});

		expect(result).toEqual(true);
	});
});