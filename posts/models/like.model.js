const { Model, DataTypes } = require('sequelize');
const DB = require('../../database');

class Like extends Model {
	/**
     * likes a post based on condition, 
     * returns existing like or new like
     * @param {object} param
     * @param {string} param.user
     * @param {string} param.postID  
     * @returns Promise<boolean>
     */
	static async likePost({ user, postID }) {
		const [,liked] = await this.findOrCreate({
			where: { likedBy: user, postId: postID },
			defaults: { likedBy: user, postId: postID }
		});

		return liked;
	}


	/**
     * unlikes a post based on condition, 
     * returns Boolean equivalent of the number of rows deleted
     * @param {object} param
     * @param {string} param.user
     * @param {string} param.postID  
     * @returns Promise<boolean>
     */
	static async unlikePost({ user, postID }) {
		const count = await this.destroy({
			where: {
				likedBy: user,
				postId: postID
			},
		});

		return !!count;
	}

}

Like.init({
	id: {
		type: DataTypes.UUID,
		allowNull: false,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true
	},
	likedBy: {
		type: DataTypes.UUID,
		allowNull: false
	},
	postId: {
		type: DataTypes.UUID,
		allowNull: false
	},
}, {
	tableName: 'likes',
	underscored: true,
	timestamps: true,
	sequelize: DB
});

module.exports = Like;