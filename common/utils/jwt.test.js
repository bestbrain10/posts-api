const key = 'coolkey';
process.env.JWTKEY = key;
const jwtLib = require('./jwt');
const jwt = require('jsonwebtoken');


describe('JWT', () => {
	it('Can decode an input payload', () => {
		const decodeSpy = jest.spyOn(jwt, 'verify').mockReturnValue('stuff');
		const result = jwtLib.decode('hello');
		expect(decodeSpy).toBeCalledWith('hello', key);
		expect(result).toBe('stuff');
	});

	it('Can encode an input payload', () => {
		const encodeSpy = jest.spyOn(jwt, 'sign').mockReturnValue('stuff');
		const result = jwtLib.encode('hello');
		expect(encodeSpy).toBeCalledWith('hello', key);
		expect(result).toBe('stuff');
	});
});