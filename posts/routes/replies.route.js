const router = require('express').Router({ mergeParams: true });
const RepliesController = require('../controllers/replies.controller');
const $ = require('express-async-handler');
const Validator = require('../../common/middlewares/validator.middleware');

router.route('/')
	.post(Validator(RepliesController.replySchema), $(RepliesController.createReply))
	.get($(RepliesController.getAllReplies));

router.route('/:reply')
	.put(Validator(RepliesController.replySchema), $(RepliesController.updateReply))
	.get($(RepliesController.getOneReply))
	.delete($(RepliesController.deleteReply));

module.exports = router;