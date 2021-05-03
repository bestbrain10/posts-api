const Post = require('../models/post.model');
const User = require('../../users/models/user.model');

Post.belongsTo(User, { foreignKey: 'createdBy', targetKey: 'id', as: 'user' });
User.hasMany(Post, { foreignKey: 'id', targetKey: 'createdBy' });


module.exports = class extends Post {
	/**
	 * Find all the post for user (if provided), within the specified offset / limit, 
	 * and get the total number of rows matching the query (or user).
	 * @param {object} param
	 * @param {string|null} param.user
	 * @param {number} param.limit
	 * @param {number} param.offet
	 * @returns Promise<{rows: Post[], count: number}>
	 */
	static async fetchPosts({ user = null, limit, offset }) {
		return this.findAndCountAll({
			...(user && {
				where: {
					createdBy: user
				}
			}),
			limit,
			offset,
			order: [
				['createdAt', 'DESC']
			],
			include: [{ model: User, attributes: ['id', 'fullname'], as: 'user' }]
		});
	}

	/**
	 * Find post based on its ID, 
	 * @param {string} postID
	 * @returns Promise<Post>
	 */
	static async fetchPost(postID) {
		return this.findByPk(postID, {
			include: [{
				model: User,
				attributes: ['id', 'fullname'],
				as: 'user'
			}]
		});
	}
};