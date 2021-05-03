const Joi = require('joi');
const ReplyRepository = require('../repositories/replies.repository');


module.exports = class {
	static get replySchema() {
		return Joi.object().keys({
			reply_body: Joi.string().required()
		});
	}

	// eslint-disable-next-line no-unused-vars
	static async createReply(req, res, next) {
		const reply = await ReplyRepository.create({
			replyBody: req.body.reply_body,
			postId: req.params.post,
			createdBy: req.user.id
		});
		res.status(201).data(reply);
	}

	// eslint-disable-next-line no-unused-vars
	static async getAllReplies(req, res, next) {
		const { limit = 30, offset = 0, user = null } = req.query;

		const replies = await ReplyRepository.fetchReplies({
			user,
			offset,
			limit,
			postID: req.params.post
		});

		res.data(replies);
	}

	// eslint-disable-next-line no-unused-vars
	static async getOneReply(req, res, next) {
		const reply = await ReplyRepository.fetchReply(req.params.reply);

		res.data(reply);
	}

	// eslint-disable-next-line no-unused-vars
	static async updateReply(req, res, next) {
		const reply = await ReplyRepository.edit({
			replyBody: req.body.reply_body,
			user: req.user.id,
			postID: req.params.post,
			replyID: req.params.reply
		});

		const statusCode = reply ? 200 : 400;
		const status = reply ? 'success' : 'error';

		res.status(statusCode).data({ updated: reply }, status);
	}

	// eslint-disable-next-line no-unused-vars
	static async deleteReply(req, res, next) {
		const reply = await ReplyRepository.deleteReply({
			postID: req.params.post,
			replyID: req.params.reply,
			user: req.user.id
		});

		const statusCode = reply ? 200 : 400;
		const status = reply ? 'success' : 'error';

		res.status(statusCode).data({ deleted: reply }, status);
	}
    
};