const Login = require('./login.model');
const { Sequelize } = require('sequelize');
const jwt = require('../common/utils/jwt');

describe('Login Model', () => {
	describe('Logout Method', () => {
		const loginSpy = jest.spyOn(Login, 'update');
		loginSpy.mockResolvedValueOnce([1]);

		let result;
		beforeAll(async () => {
			result = await Login.logoutUser(1);
		});

		it('it updates the login entry', () => {
			expect(loginSpy).toBeCalledWith({
				loggedOut: true,
				loggedOutAt: Sequelize.literal('CURRENT_TIMESTAMP')
			}, {
				where: {
					id: 1,
					loggedOut: null,
				},
			});
		});

		it('returns true if update count is greater than or equal to one', () => {
			expect(result).toBe(true);
		});
	});


	describe('decodeLoginToken Method', () => {
        
		it('it decodes the input token returns the loginID if valid', () => {
			const jwtSpy = jest.spyOn(jwt, 'decode');
			jwtSpy.mockReturnValueOnce({ loginID: 56 });

			const result = Login.decodeLoginToken('jibberish');
			expect(jwtSpy).toBeCalledWith('jibberish');
			expect(result).toBe(56);
		});


		it('returns null if loginID is not found in decoded payload', () => {
			const jwtSpy = jest.spyOn(jwt, 'decode');
			jwtSpy.mockReturnValueOnce({
				location: 'Asgard'
			});

			const result = Login.decodeLoginToken('jibberish');

			expect(jwtSpy).toBeCalledWith('jibberish');
			expect(result).toBe(null);
		});


		it('returns null if error occured will decoding', () => {
			const jwtSpy = jest.spyOn(jwt, 'decode');
			jwtSpy.mockImplementationOnce(() => { throw new Error('Cannot decode for some reason'); });

			const result = Login.decodeLoginToken('jibberish');

			expect(jwtSpy).toBeCalledWith('jibberish');
			expect(result).toBe(null);
		});
	});

	describe('Verify Login', () => {
		it('Fetches Login if not logged out', async () => {
			const fetchSpy = jest.spyOn(Login, 'findOne');
			fetchSpy.mockResolvedValueOnce({ id: 33, loggedOut: null });

			const result = await Login.verifyLogin(33);

			expect(fetchSpy).toBeCalledWith({
				where: {
					id: 33,
					loggedOut: null
				},
				attributes: ['user']
			});

			expect(result).toMatchObject({ id: 33, loggedOut: null });
		});
	});

	describe('Login User', () => {
		it('creates a login record and attaches token to input user', async () => {
			const createSpy = jest.spyOn(Login, 'create');
			createSpy.mockResolvedValueOnce({ id: 33, loggedOut: null });

			const encodeSpy = jest.spyOn(jwt, 'encode');
			encodeSpy.mockReturnValueOnce('jibberish');

			const result = await Login.loginUser({ id: 5 });

			expect(createSpy).toBeCalledWith({
				user: 5
			});

			expect(encodeSpy).toBeCalledWith({ loginID: 33 });

			expect(result).toMatchObject({ id: 5, token: 'jibberish' });
		});

	});
});