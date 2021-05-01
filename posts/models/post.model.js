const { Model, DataTypes, } = require('sequelize');
const DB = require('../../database');

class Post extends Model {
	/**
     * Edits a post by replaces its body with a new one
     * @param {object} param
     * @param {string} param.post ID of post to be editted
     * @param {string} param.user ID of user that created the post
     * @param {string} param.postbody new post body
     * @returns 
     */
	static async edit({ post, user, postBody }) {
		const [ count ] = await this.update({
			postBody,
			edited: true
		}, {
			where: {
				createdBy: user,
				id: post
			},
		});

		return !!count;
	}

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
			// order: {}
		});
	}

	/**
	 * Find post based on its ID, 
	 * @param {string} postID
	 * @returns Promise<Post>
	 */
	static async fetchPost(postID) {
		return this.findByPk(postID);
	}

	/**
	 * deletes post based on condition, 
	 * returns Boolean equivalent of the number of rows deleted
	 * @param {object} param
	 * @param {string} param.user
	 * @param {string} param.postID  
	 * @returns Promise<boolean>
	 */
	static async deletePost({ user, postID }) {
		const  count = await this.destroy({
			where: {
				createdBy: user,
				id: postID
			},
		});

		return !!count;
	}
	
}

Post.init({
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
	postBody: {
		type: DataTypes.TEXT,
		allowNull: false
	},
	edited: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
}, {
	tableName: 'posts',
	underscored: true,
	timestamps: true,
	sequelize: DB
});

module.exports = Post;