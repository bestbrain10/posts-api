
const Post = require('../models/post.model');
const User = require('../../users/models/user.model');
const countSubQuery = require('./count-sub-query');
const Likes = require('../models/like.model');
const Replies = require('../models/reply.model');

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
		// const modelName = this.modelName;
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
			attributes: {
				include: [
					[countSubQuery({
						table: Likes.tableName,
						column: 'post_id',
						foreignTable: 'Post',
						foreignKey: 'id'
					}), 'likeCount'],
					[countSubQuery({
						table: Replies.tableName,
						column: 'post_id',
						foreignTable: 'Post',
						foreignKey: 'id'
					}), 'replyCount'],
				]
			},
			include: [
				{ model: User, attributes: ['id', 'fullname'], as: 'user' },
			]
		});
	}

	/**
	 * Find post based on its ID, 
	 * @param {string} postID
	 * @returns Promise<Post>
	 */
	static async fetchPost(postID) {
		return this.findByPk(postID, {
			attributes: {
				include: [
					[countSubQuery({
						table: Likes.tableName,
						column: 'post_id',
						foreignTable: 'Post',
						foreignKey: 'id'
					}), 'likeCount'],
					[countSubQuery({
						table: Replies.tableName,
						column: 'post_id',
						foreignTable: 'Post',
						foreignKey: 'id'
					}), 'replyCount'],
				]
			},
			include: [
				{
					model: User,
					attributes: ['id', 'fullname'],
					as: 'user'
				}
			]
		});
	}
};