const User = require('./user.model');
const { omit } = require('lodash');
const hashPassword = require('../../common/utils/hash-password');
const Email = require('../../emails');
jest.mock('../../emails');
const jwt = require('../../common/utils/jwt');


describe('User Model', () => {
    
	describe('Register', () => {
		const registerParams = {
			fullname: 'Steve Rogers',
			email: 'captainamerica@avengers.com',
			password: 'password'
		};

		it('Returns error if email already exists', async () => {
			const countSpy = jest.spyOn(User, 'count');
			countSpy.mockResolvedValueOnce(1);

			try{
				await User.register(registerParams);
			} catch(e) {
				expect(countSpy).toBeCalledWith({
					where: {
						email: registerParams.email
					},
				});
				expect(e).toMatchObject({ email: 'Email already exists' });
			}
		});

		it('Returns new user if email does not exist', async () => {
			const countSpy = jest.spyOn(User, 'count');
			countSpy.mockResolvedValueOnce(0);

			const createSpy = jest.spyOn(User, 'create');
			createSpy.mockResolvedValueOnce({ id: 54, ...registerParams, toJSON(){
				return {
					id: 54,
					...registerParams
				};
			}  });

			const result = await User.register(registerParams);

			expect(result).toMatchObject({
				id: 54,
				...omit(registerParams, ['password'])
			});
            
			expect(countSpy).toBeCalledWith({
				where: {
					email: registerParams.email
				},
			});

			expect(Email).toBeCalledWith({
				data: {
					fullname: registerParams.fullname,
				},
				subject: 'Welcome onboard!',
				email: registerParams.email,
				template: 'welcome'
			});

			expect(createSpy).toBeCalledWith(registerParams);
		});
	});

	describe('Login', () => {
		const loginParams = {
			email: 'blackwidow@avengers.com',
			password: 'password'
		};

		it('returns error if email does not exist', async () => {
			const scopeSpy = jest.spyOn(User, 'scope');
			const findSpy = jest.fn().mockResolvedValueOnce(null);
			scopeSpy.mockReturnValue({ findOne: findSpy });

			try{
				await User.login(loginParams);
			}catch(e) {
				expect(scopeSpy).toBeCalledWith('withPassword');
				expect(findSpy).toBeCalledWith({
					where: {
						email: loginParams.email
					}
				});

				expect(e).toMatchObject({ email: 'Email does not exist' });
			}
		});

		it('returns error if password is incorrect', async () => {
			const scopeSpy = jest.spyOn(User, 'scope');
			const compareSpy = jest.fn().mockReturnValueOnce(false);
			const findSpy = jest.fn().mockResolvedValueOnce({ comparePassword: compareSpy });
			scopeSpy.mockReturnValue({ findOne: findSpy });

			try {
				await User.login(loginParams);
			} catch (e) {
				expect(scopeSpy).toBeCalledWith('withPassword');
				expect(findSpy).toBeCalledWith({
					where: {
						email: loginParams.email
					}
				});
				expect(compareSpy).toBeCalledWith(loginParams.password);

				expect(e).toMatchObject({
					password: 'Incorrect password'
				});
			}
		});


		it('returns user object if email and password are correct', async () => {
			const user = { id: 1, ...loginParams };
			const scopeSpy = jest.spyOn(User, 'scope');
			const compareSpy = jest.fn().mockReturnValueOnce(true);
			const findSpy = jest.fn().mockResolvedValueOnce({
				comparePassword: compareSpy,
				toJSON(){ return user; },
			});
			scopeSpy.mockReturnValue({
				findOne: findSpy
			});

			const result = await User.login(loginParams);

			expect(scopeSpy).toBeCalledWith('withPassword');
			expect(findSpy).toBeCalledWith({
				where: {
					email: loginParams.email
				}
			});
			expect(compareSpy).toBeCalledWith(loginParams.password);

			expect(result).toMatchObject(omit(user, ['password']));
		});
	});

	describe('Password', () =>  {
		afterEach(() => {
			jest.clearAllMocks();
		});
		it('Can compare password with wrong password, returns false', () => {
			const user = new User({ password: 'hello' });

			expect(user.comparePassword('hello')).toEqual(false);
		});

		it('Can compare password with correct password, returns true', () => {
			const user = new User({
				password: hashPassword('hello')
			});

			expect(user.comparePassword('hello')).toEqual(true);
		});

		it('Can change password', async () => {
			const updateSpy = jest.spyOn(User, 'update').mockResolvedValueOnce([1]);
			const userID = '123';
			const password = 'password';
			const newPassword = 'newPassword';

			const result = await User.changePassword({ userID, password, newPassword });

			expect(result).toEqual(true);
			expect(updateSpy).toBeCalledWith({
				password: hashPassword(newPassword)
			}, {
				where: {
					password: hashPassword(password),
					id: userID
				}
			});
		});

		it('Can change password if old password is wrong', async () => {
			const updateSpy = jest.spyOn(User, 'update').mockResolvedValueOnce([0]);
			const userID = '123';
			const password = 'password';
			const newPassword = 'newPassword';

			try {
				await User.changePassword({
					userID,
					password,
					newPassword
				});
			} catch(e) {
				expect(e).toEqual({ password: 'Incorrect password' });
				expect(updateSpy).toBeCalledWith({
					password: hashPassword(newPassword)
				}, {
					where: {
						password: hashPassword(password),
						id: userID
					}
				});
			}

		});

		it('it decodes the input token returns the userID if valid', () => {
			const jwtSpy = jest.spyOn(jwt, 'decode');
			jwtSpy.mockReturnValueOnce({
				user: 56
			});

			const result = User.validatePasswordResetToken('jibberish');
			expect(jwtSpy).toBeCalledWith('jibberish');
			expect(result).toBe(56);
		});


		it('returns error if user is not found in decoded payload', async () => {
			const jwtSpy = jest.spyOn(jwt, 'decode');
			jwtSpy.mockReturnValueOnce({
				location: 'Asgard'
			});

			try {
				await User.validatePasswordResetToken('jibberish');
			}catch(e) {
				expect(jwtSpy).toBeCalledWith('jibberish');
				expect(e).toBe('invalid password reset token');
			}
		});

		it('returns error if token is expired', async () => {
			process.env.JWTKEY = 'magickey';
			const token = jwt.encode({
				user: 'oof',
				exp: Math.floor(Date.now() / 1000) - (60 * 60),
			});

			try {
				await User.validatePasswordResetToken(token);
			} catch (e) {
				expect(e).toBe('token expired, try requesting for another one');
			}
		});


		it('returns error decoding throws error', async () => {
			const jwtSpy = jest.spyOn(jwt, 'decode');
			jwtSpy.mockRejectedValueOnce({
				name: 'AnyOtherError'
			});

			try {
				await User.validatePasswordResetToken('jibberish');
			} catch (e) {
				expect(jwtSpy).toBeCalledWith('jibberish');
				expect(e).toBe('invalid password reset token');
			}
		});


		it('returns error if error occured will decoding', async () => {
			const jwtSpy = jest.spyOn(jwt, 'decode');
			jwtSpy.mockImplementationOnce(() => {
				throw new Error('Cannot decode for some reason');
			});

			try {
				await User.validatePasswordResetToken('jibberish');
			} catch(e) {
				expect(jwtSpy).toBeCalledWith('jibberish');
				expect(e).toBe('invalid password reset token');
			}

		});

		it('Can request for password reset', async () => {
			const token = 'stuffJustEncoded';
			const findSpy = jest.spyOn(User, 'findOne').mockResolvedValueOnce({ fullname: 'Scott Lang', id: '5456' });
			const encodeSpy = jest.spyOn(jwt, 'encode').mockReturnValue(token);
			const email = 'antman@avengers.com';
			const result = await User.requestPasswordReset(email);
			expect(result).toEqual(true);
			expect(findSpy).toBeCalledWith({ where: { email } });
			expect(encodeSpy).toBeCalledWith({
				user: '5456',
				exp: Math.floor(Date.now() / 1000) + (60 * 60)
			});
			expect(Email).toBeCalledWith({
				data: {
					fullname: 'Scott Lang',
					token
				},
				subject: 'Reset Password',
				email,
				template: 'reset-password'
			});
		});

		it('Password reset request for non-existing user returns error', async () => {
			const findSpy = jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);

			const email = 'thanos@avengers.com';
			try {
				await User.requestPasswordReset(email);
			}catch(e) {
				expect(e).toEqual({
					email: 'User account does not exist'
				});
				expect(findSpy).toBeCalledWith({
					where: {
						email
					}
				});
			}
		});

		it('Can reset password', async () => {
			const updateSpy = jest.spyOn(User, 'update').mockResolvedValue([1]);
			const token = 'infinity stones';
			const password = 'Gamora';
			const userID = '234';
			const decodeSpy = jest.spyOn(User, 'validatePasswordResetToken').mockResolvedValue(userID);

			const result = await User.resetPassword({ token, password });
			expect(updateSpy).toBeCalledWith({
				password: hashPassword(password)
			}, {
				where: {
					id: userID
				}
			});
			expect(decodeSpy).toBeCalledWith(token);
			expect(result).toEqual(true);
		});

		it('Cannot reset password if user in token does not exist', async () => {
			const updateSpy = jest.spyOn(User, 'update').mockResolvedValue([0]);
			const token = 'infinity stones';
			const password = 'Gamora';
			const userID = '234';
			const decodeSpy = jest.spyOn(User, 'validatePasswordResetToken').mockResolvedValue(userID);

			try {
				await User.resetPassword({
					token,
					password
				});
			}catch(e) {
				expect(updateSpy).toBeCalledWith({
					password: hashPassword(password)
				}, {
					where: {
						id: userID
					}
				});
				expect(decodeSpy).toBeCalledWith(token);
				expect(e).toEqual('User account does not exist');
			}
		});
	});
});