const hashPasswordHook = require('./hash-password-hook');
const hashPassword = require('../../common/utils/hash-password');
jest.mock('../../common/utils/hash-password');
describe('Hash Password Hook', () => {
	it('hashes user password', () => {
		hashPasswordHook({ password: 'stuff' });
		expect(hashPassword).toBeCalledWith('stuff');
	});
});