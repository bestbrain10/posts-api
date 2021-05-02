
const router = require('express').Router();
const PostsController = require('../controllers/posts.controller');
const $ = require('express-async-handler');
const Validator = require('../../common/middlewares/validator.middleware');
const LikesRoutes = require('./likes.route');
const ReplyRoutes = require('./replies.route');
const imageFilter = require('../../common/utils/image-filter');
const multer = require('multer')({ dest: 'uploads', fileFilter: imageFilter });

router.route('/')
	.get($(PostsController.getAllPosts))
	.post(multer.single('media'), Validator(PostsController.postSchema), $(PostsController.create));

router.route('/:post')
	.get($(PostsController.getOnePost))
	.delete($(PostsController.deletePost))
	.put(multer.single('media'), Validator(PostsController.postSchema), $(PostsController.updatePost));

router.use('/:post/likes', PostsController.postExists, LikesRoutes);
router.use('/:post/replies', PostsController.postExists, ReplyRoutes);

module.exports = router;