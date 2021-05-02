const router = require('express').Router();
const Validator = require('../../common/middlewares/validator.middleware');
const LoginController = require('../controllers/login.controller');
const SignupController = require('../controllers/signup.controller');
const ResetPasswordController = require('../controllers/reset-password.controller');
const $ = require('express-async-handler');


router.post(
	'/login', 
	Validator(LoginController.loginSchema), 
	$(LoginController.login)
);

router.post(
	'/register', 
	Validator(SignupController.registerSchema), 
	$(SignupController.register)
);


router.post(
	'/password-reset-request', 
	Validator(ResetPasswordController.requestPasswordResetSchema),
	$(ResetPasswordController.requestPasswordReset)
);

router.post(
	'/password-reset/:token',
	Validator(ResetPasswordController.resetPasswordSchema),
	ResetPasswordController.checkPasswordRepeat,
	$(ResetPasswordController.resetPassword)
);

module.exports = router;