const { Model, DataTypes, } = require('sequelize');
const DB = require('../../database');
const mediaLinkVirtual = require('./media-link-virtual');

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
	
	/**
	 * checks if a post exists using its ID
	 * @param {string} postID 
	 * @returns 
	 */
	static async exists(postID) {
		const post = await Post.count({
			where: {
				id: postID
			}
		});

		return !!post;
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
	media: {
		type: DataTypes.TEXT,
	},
	mediaLink: {
		type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, ['media']),
		get: mediaLinkVirtual
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
	modelName: 'Post',
	sequelize: DB
});

module.exports = Post;