const { Model, DataTypes, } = require('sequelize');
const DB = require('../../database');

class Reply extends Model {
	/**
     * Edits a reply by replaces its body with a new one
     * @param {object} param
     * @param {string} param.postID ID of post to be editted
     * @param {string} param.user ID of user that created the post
     * @param {string} param.replyBody new post body
	 * @param {string} param.replyID new post body
     * @returns 
     */
	static async edit({ postID, user, replyBody, replyID }) {
		const [count] = await this.update({
			replyBody,
			edited: true
		}, {
			where: {
				createdBy: user,
				postId: postID,
				id: replyID
			},
		});

		return !!count;
	}

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
			offset
		});
	}

	/**
     * Find post reply based on its ID, 
     * @param {string} replyID
     * @returns Promise<Reply>
     */
	static async fetchReply(replyID) {
		return this.findByPk(replyID);
	}

	/**
     * deletes reply based on condition, 
     * returns Boolean equivalent of the number of rows deleted
     * @param {object} param
     * @param {string} param.user
     * @param {string} param.postID  
     * @param {string} param.replyID  
     * @returns Promise<boolean>
     */
	static async deleteReply({ user, postID, replyID }) {
		const count = await this.destroy({
			where: {
				createdBy: user,
				postId: postID,
				id: replyID
			},
		});

		return !!count;
	}
}

Reply.init({
	id: {
		type: DataTypes.UUID,
		allowNull: false,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true
	},
	createdBy: {
		type: DataTypes.UUID,
		allowNull: false
	},
	postId: {
		type: DataTypes.UUID,
		allowNull: false
	},
	replyBody: {
		type: DataTypes.TEXT,
		allowNull: false
	},
	edited: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
}, {
	tableName: 'replies',
	underscored: true,
	timestamps: true,
	sequelize: DB
});

module.exports = Reply;