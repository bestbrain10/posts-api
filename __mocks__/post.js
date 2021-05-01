const Post = require('../posts/models/post.model');

module.exports = (posts) => {
	if(Array.isArray(posts)) {
		return Post.bulkCreate(posts);
	}

	const { createdBy, postBody } = posts;
	return Post.create({
		createdBy,
		postBody
	});
};
