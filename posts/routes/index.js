
const router = require('express').Router();
const PostsController = require('../controllers/posts.controller');
const $ = require('express-async-handler');
const Validator = require('../../common/middlewares/validator.middleware');

router.route('/')
	.get($(PostsController.getAllPosts))
	.post(Validator(PostsController.postSchema), $(PostsController.create));

router.route('/:post')
	.get($(PostsController.getOnePost))
	.delete($(PostsController.deletePost))
	.put(Validator(PostsController.postSchema), $(PostsController.deletePost));


module.exports = router;