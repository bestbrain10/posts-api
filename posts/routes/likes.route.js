const router = require('express').Router({ mergeParams: true });
const LikesController = require('../controllers/likes.controller');
const $ = require('express-async-handler');

router.route('/')
	.post($(LikesController.likePost))
	.delete($(LikesController.unlikePost));

module.exports = router;