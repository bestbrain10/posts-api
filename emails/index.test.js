const emailUtil = require('./index');
const mailClient = require('../common/utils/aws-ses');
jest.mock('../common/utils/aws-ses');
const ejs = require('ejs');

describe('Email Utility', () => {

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('returns error if template file is not found', async () => {
		try {
			await emailUtil({
				data: {
					prop: 'value'
				},
				email: 'test@email.com',
				subject: 'Subject',
				template: 'non-existent',
				name: 'Random SHEILD AGENT'
			});
		} catch (e) {
			expect(e).toEqual('Template non-existent does not exist');
		}
	});

	it('existing template triggers email', async () => {
		process.env = {
			stuff: 'rando rando',
			NODE_ENV: 'development'
		};
		const ejsSpy = jest.spyOn(ejs, 'renderFile').mockResolvedValueOnce('stuff to send');
		mailClient.mockResolvedValueOnce('done');

		await emailUtil({
			data: {
				prop: 'value'
			},
			email: 'test@email.com',
			subject: 'Subject',
			template: 'welcome',
			name: 'Random SHEILD AGENT'
		});

		expect(ejsSpy).toBeCalledWith('emails/templates/welcome.ejs', {
			...process.env,
			prop: 'value'
		});

		expect(mailClient).toBeCalledWith({
			body: 'stuff to send',
			email: 'test@email.com',
			subject: 'Subject',
			name: 'Random SHEILD AGENT'
		});

	});

	it('any failure sending mails is logged to the console', async () => {
		process.env = {
			stuff: 'rando rando',
			NODE_ENV: 'development'
		};
		const ejsSpy = jest.spyOn(ejs, 'renderFile').mockResolvedValueOnce('stuff to send');
		const consoleSpy = jest.spyOn(console, 'log').mockReturnValue(null);
		mailClient.mockRejectedValueOnce('error occured while sending mail');

		await emailUtil({
			data: {
				prop: 'value'
			},
			email: 'test@email.com',
			subject: 'Subject',
			template: 'welcome',
			name: 'Random SHEILD AGENT'
		});

		expect(ejsSpy).toBeCalledWith('emails/templates/welcome.ejs', {
			...process.env,
			prop: 'value'
		});

		expect(mailClient).toBeCalledWith({
			body: 'stuff to send',
			email: 'test@email.com',
			subject: 'Subject',
			name: 'Random SHEILD AGENT'
		});

		expect(consoleSpy.mock.calls).toHaveLength(2);
		expect(consoleSpy.mock.calls[0][0]).toBe('Mail error');
		expect(consoleSpy.mock.calls[1][0]).toBe('error occured while sending mail');
	});

	it('does not send mail in CI or TEST environment', async () => {
		process.env = {
			stuff: 'rando rando',
			NODE_ENV: 'ci'
		};

		const ejsSpy = jest.spyOn(ejs, 'renderFile').mockResolvedValueOnce('stuff to send');

		await emailUtil({
			data: {
				prop: 'value'
			},
			email: 'test@email.com',
			subject: 'Subject',
			template: 'welcome',
			name: 'Random SHEILD AGENT'
		});

		expect(ejsSpy).toBeCalledWith('emails/templates/welcome.ejs', {
			...process.env,
			prop: 'value'
		});

		expect(mailClient).not.toHaveBeenCalled();
	});
});