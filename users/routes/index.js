const router = require('express').Router();
const UsersController = require('../controllers/users.controller');
const $ = require('express-async-handler');
const Validator = require('../../common/middlewares/validator.middleware');


router.get('/profile', $(UsersController.profile));
router.get('/:user', $(UsersController.getOneUser));
router.get('/', $(UsersController.getAllUsers));

router.put('/changepassword', 
	Validator(UsersController.changePasswordSchema), 
	$(UsersController.passwordRepeatCheck),
	$(UsersController.changePassword)
);


module.exports = router;