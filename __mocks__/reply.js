const Reply = require('../posts/models/reply.model');

module.exports = (replies) => {
	if (Array.isArray(replies)) {
		return Reply.bulkCreate(replies);
	}

	const { replyBody, createdBy, postId } = replies;
	return Reply.create({
		createdBy,
		replyBody,
		postId
	});
};