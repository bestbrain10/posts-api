const Reply = require('./reply.model');

describe('Reply Model', () => {
	it('Adds edited: true when updating a reply', async () => {
		const replySpy = jest.spyOn(Reply, 'update').mockResolvedValue([1]);
		const args = {
			postID: '123',
			replyID: '123',
			replyBody: 'new body',
			user: '123'
		};
		const result = await Reply.edit(args);

		expect(replySpy).toBeCalledWith({
			replyBody: args.replyBody,
			edited: true
		}, {
			where: {
				id: args.replyID,
				createdBy: args.user,
				postId: args.postID
			}
		});
		expect(result).toEqual(true);
	});



	it('deletes post', async () => {
		const replySpy = jest.spyOn(Reply, 'destroy').mockResolvedValueOnce(3);

		const result = await Reply.deleteReply({
			user: '123',
			postID: '789',
			replyID: '456'
		});

		expect(result).toEqual(true);
		expect(replySpy).toBeCalledWith({
			where: {
				createdBy: '123',
				postId: '789',
				id: '456'
			}
		});
	});
});