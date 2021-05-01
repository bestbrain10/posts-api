
process.env = { stuff: 'rando rando' };
const emailUtil = require('./index');
const mailJet = require('../common/utils/mailjet');
jest.mock('../common/utils/mailjet');
const ejs = require('ejs');

describe('Email Utility', () => {
	it('returns error if template file is not found', () => {
		try {
			emailUtil({
				data: { prop: 'value' },
				email: 'test@email.com',
				subject: 'Subject',
				template: 'non-existent',
				name: 'Random SHEILD AGENT'
			});
		}catch(e) {
			expect(e).toEqual('Template non-existent does not exist');
		}
	});

	it('existing template triggers email', async () => {
		
		const ejsSpy = jest.spyOn(ejs, 'renderFile').mockResolvedValueOnce('stuff to send');

		await emailUtil({
			data: { prop: 'value' },
			email: 'test@email.com',
			subject: 'Subject',
			template: 'welcome',
			name: 'Random SHEILD AGENT'
		});
		
		expect(ejsSpy).toBeCalledWith('emails/templates/welcome.ejs', {
			...process.env,
			prop: 'value'
		});

		expect(mailJet).toBeCalledWith({
			body: 'stuff to send',
			email: 'test@email.com',
			subject: 'Subject',
			name: 'Random SHEILD AGENT'
		});

	});

	it('any failure sending mails is logged to the console', async () => {
		
		const ejsSpy = jest.spyOn(ejs, 'renderFile').mockRejectedValueOnce('error from compiling template');
		const consoleSpy = jest.spyOn(console, 'log').mockReturnValue(null);

		await emailUtil({
			data: { prop: 'value' },
			email: 'test@email.com',
			subject: 'Subject',
			template: 'welcome',
			name: 'Random SHEILD AGENT'
		});

		expect(ejsSpy).toBeCalledWith('emails/templates/welcome.ejs', {
			...process.env,
			prop: 'value'
		});

		expect(mailJet).toBeCalledWith({
			body: 'stuff to send',
			email: 'test@email.com',
			subject: 'Subject',
			name: 'Random SHEILD AGENT'
		});

		expect(consoleSpy.mock.calls).toHaveLength(2);
		expect(consoleSpy.mock.calls[0][0]).toBe('Mail Error');
		expect(consoleSpy.mock.calls[1][0]).toBe('error from compiling template');
	});
});