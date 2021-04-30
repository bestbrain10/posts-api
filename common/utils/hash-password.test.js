const hashPassword = require('./hash-password');
const crypto = require('crypto');


describe('Hash Password Function', () => {
	it('Creates a sha256 of an input string', () => {
		const hash = 'sweethashbyanavenger';
		const input = 'thumb';

		const digestFn = jest.fn().mockReturnValueOnce(hash);
		const updateFn = jest.fn().mockReturnValueOnce({
			digest: digestFn
		});
		const hashSpy = jest.spyOn(crypto, 'createHash').mockReturnValueOnce({
			update: updateFn
		});

		const result = hashPassword(input);
		expect(result).toBe(hash);
		expect(hashSpy).toBeCalledWith('sha256');
		expect(updateFn).toBeCalledWith(input);
		expect(digestFn).toBeCalledWith('hex');
	});
});

