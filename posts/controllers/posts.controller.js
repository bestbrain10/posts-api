
const Joi = require('joi');
const Post = require('../models/post.model');

module.exports = class {
	static get postSchema() {
		return Joi.object().keys({
			post_body: Joi.string().required()
		});
	}

	// eslint-disable-next-line no-unused-vars
	static async create(req, res, next) {
		const post = await Post.create({
			postBody: req.body.post_body,
			createdBy: req.user.id
		});
		res.status(201).data(post);
	}

	// eslint-disable-next-line no-unused-vars
	static async getAllPosts(req, res, next) {
		const { limit = 30, offset = 0, user = null } = req.query;

		const posts = await Post.fetchPosts({ user, offset, limit });

		res.data(
			posts
		);
	}

	// eslint-disable-next-line no-unused-vars
	static async getOnePost(req, res, next) {
		const post = await Post.fetchPost(req.params.post);

		res.data( post );
	}


	// eslint-disable-next-line no-unused-vars
	static async updatePost(req, res, next) {
		const post = await Post.edit({
			postBody: req.body.post_body,
			user: req.user.id,
			post: req.params.post
		});

		const statusCode = post ? 200 : 400; 
		const status = post ? 'success' : 'error';

		res.status(statusCode).data({ updated: post }, status);
	}

	// eslint-disable-next-line no-unused-vars
	static async deletePost(req, res, next) {
		const post = await Post.deletePost({
			postID: req.params.post,
			user: req.user.id
		});

		const statusCode = post ? 200 : 400;
		const status = post ? 'success' : 'error';

		res.status(statusCode).data({ deleted: post }, status);
	}
};
