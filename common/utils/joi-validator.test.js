
const Joi = require('joi');
const joiValidator = require('./joi-validator');

describe('Joi Validator', () => {
	// does not abort early
	describe('Validate', () => {
		test('Does not abort early', async () => {
			const schema = Joi.object().keys({
				power: Joi.number().integer().required(),
				name: Joi.string().required()
			});
    
			const payload = {
				power: 'covering eyes'
			};
    
			try {
				await joiValidator.validate(payload, schema);
			} catch(e) {
				expect(e).toMatchObject({
					power: 'power must be a number',
					name: 'name is required'
				});
			}
		});

		test('removes unknown keys from payload', async () => {
			const schema = Joi.object().keys({
				power: Joi.number().integer().required(),
				name: Joi.string().required()
			});

			const payload = {
				power: 1,
				name: 'Hulk',
				realName: 'Bruce Banners'
			};

            
			const result = await joiValidator.validate(payload, schema);
        
			expect(result).toMatchObject({
				power: 1,
				name: 'Hulk'
			});
		});

		test('converts values based on validation rule', async () => {
			const schema = Joi.object().keys({
				power: Joi.number().integer().required(),
				name: Joi.string().lowercase().required()
			});

			const payload = {
				power: 1,
				name: 'HuLk',
			};


			const result = await joiValidator.validate(payload, schema);

			expect(result).toMatchObject({
				power: 1,
				name: 'hulk'
			});
		});
	});

	describe('Reduce Errors', () => {
		test('Can modify errors to simple POJO', () => {
			const errors = [{
				context: {
					label: 'powers',
				},
				message: 'stuff about "power"'
			}, {
				context: {
					key: 'weapon',
				},
				message: 'stuff about "weapon"'
			}];


			const result = errors.reduce(joiValidator.errorReducer, {});

			expect(result).toMatchObject({
				powers: 'stuff about power',
				weapon: 'stuff about weapon'
			});
		});
	});

	describe('Modify Errors', () => {
		test('returns error message is details is not present', () => {
			const errors = {
				message: 'I got stuff for you'
			};

			const result = joiValidator.modifyErrors(errors);
			expect(result).toBe(errors.message);
		});

		test('returns modified error details if present', () => {
			const errors = {
				details: [{
					context: {
						label: 'powers',
					},
					message: 'stuff about "power"'
				}, {
					context: {
						key: 'weapon',
					},
					message: 'stuff about "weapon"'
				}]
			};

			const result = joiValidator.modifyErrors(errors);
			expect(result).toMatchObject({
				powers: 'stuff about power',
				weapon: 'stuff about weapon'
			});
		});
	});
});