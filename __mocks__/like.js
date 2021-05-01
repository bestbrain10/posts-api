const Like = require('../posts/models/like.model');

module.exports = ({ like, postID, user }) => {
	if(like) {
		return Like.likePost({ user, postID });
	}

	return Like.unlikePost({ user, postID });
};