
const Like = require('../models/like.model');

module.exports = class {
	// eslint-disable-next-line no-unused-vars
	static async likePost(req, res, next) {
		const like = await Like.likePost({ 
			user: req.user.id,
			postID: req.params.post
		});
        
		const statusCode = like ? 200 : 400;
		const status = like ? 'success' : 'error';

		res.status(statusCode).data({ liked: like }, status);
	}

	// eslint-disable-next-line no-unused-vars
	static async unlikePost(req, res, next) {
		const unlike = await Like.unlikePost({
			user: req.user.id,
			postID: req.params.post
		});

		const statusCode = unlike ? 200 : 400;
		const status = unlike ? 'success' : 'error';

		res.status(statusCode).data({ unliked: unlike }, status);
	}
};