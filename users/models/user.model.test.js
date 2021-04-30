const User = require('./user.model');
const { omit } = require('lodash');


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
});