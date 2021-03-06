
const Joi = require('joi');
const PostRepository = require('../repositories/posts.repository');

module.exports = class {
	static get postSchema() {
		return Joi.object().keys({
			post_body: Joi.string().required()
		});
	}

	// eslint-disable-next-line no-unused-vars
	static async create(req, res, next) {
		const post = await PostRepository.create({
			...(req.file && { media: req.file.filename }),
			postBody: req.body.post_body,
			createdBy: req.user.id
		});
		res.status(201).data(post);
	}

	// eslint-disable-next-line no-unused-vars
	static async getAllPosts(req, res, next) {
		const { limit = 30, offset = 0, user = null } = req.query;

		const posts = await PostRepository.fetchPosts({ user, offset, limit });

		res.data(
			posts
		);
	}

	// eslint-disable-next-line no-unused-vars
	static async getOnePost(req, res, next) {
		const post = await PostRepository.fetchPost(req.params.post);

		res.data( post );
	}

	static async postExists(req, res, next) {
		const post = await PostRepository.exists(req.params.post);

		if(!post) {
			return res.status(404).error({ post: 'post does not exist' });
		}

		next();
	}


	// eslint-disable-next-line no-unused-vars
	static async updatePost(req, res, next) {
		const post = await PostRepository.edit({
			...(req.file && { media: req.file.filename }),
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
		const post = await PostRepository.deletePost({
			postID: req.params.post,
			user: req.user.id
		});

		const statusCode = post ? 200 : 400;
		const status = post ? 'success' : 'error';

		res.status(statusCode).data({ deleted: post }, status);
	}
};
