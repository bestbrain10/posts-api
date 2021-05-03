const Reply = require('../models/reply.model');
const User = require('../../users/models/user.model');

Reply.belongsTo(User, { foreignKey: 'createdBy', targetKey: 'id', as: 'user' });
User.hasMany(Reply, { foreignKey: 'id', targetKey: 'createdBy' });

module.exports = class extends Reply {
	/**
     * Find all the replies for user (if provided), within the specified offset / limit, 
     * and get the total number of rows matching the query (or user).
     * @param {object} param
     * @param {string|null} param.user
     * @param {number} param.limit
     * @param {number} param.offset
     * @param {string} param.postID
     * @returns Promise<{rows: Reply[], count: number}>
     */
	static async fetchReplies({ user = null, limit, offset, postID }) {
		return this.findAndCountAll({
			where: {
				...(user && {
					createdBy: user
				}),
				postId: postID
			},
			limit,
			offset,
			include: [{
				model: User,
				attributes: ['id', 'fullname'],
				as: 'user'
			}]
		});
	}

	/**
     * Find post reply based on its ID, 
     * @param {string} replyID
     * @returns Promise<Reply>
     */
	static async fetchReply(replyID) {
		return this.findByPk(replyID, {
			include: [{
				model: User,
				attributes: ['id', 'fullname'],
				as: 'user'
			}]
		});
	}

};