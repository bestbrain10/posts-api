const router = require('express').Router();
const Validator = require('../../common/middlewares/validator.middleware');
const LoginController = require('../controllers/login.controller');
const SignupController = require('../controllers/signup.controller');
const $ = require('express-async-handler');


router.post('/login', Validator(LoginController.loginSchema), $(LoginController.login));
router.post('/register', Validator(SignupController.registerSchema), $(SignupController.register));

module.exports = router;