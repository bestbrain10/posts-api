const joiValidator = require('../utils/joi-validator');

/**
 * takes in a joi validation schema
 * and returns a middleware to run a preconfigued joi validator
 * @param {JoiSchema} schema
 * @returns middleware
 */
module.exports = (schema) => async (req, res, next) => {
	try {
		const value = await joiValidator.validate(req.body || {}, schema);
		req.bodyOld = req.body;
		// refined request body
		req.body = value;
		next();
	} catch (error) {
		// refined error message
		res.status(400).error(error);
	}
};