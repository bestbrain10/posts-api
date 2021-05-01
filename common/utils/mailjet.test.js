
process.env ={
	MAIL_SENDER: 'app@email.com',
	SMTP_USERNAME: 'username',
	SMTP_PASSWORD: 'password'
};

const mailJet = require('node-mailjet');
const mailJetLib = require('./mailjet');

describe('Mail Jet Utility function', () => {
	it('Sends mail given arguments and environmental variables', async () => {
		const requestSpy = jest.fn().mockReturnValueOnce(true);
		const postSpy = jest.fn().mockReturnValueOnce({ request: requestSpy}); 
		const mailJetSpy = jest.spyOn(mailJet, 'connect').mockReturnValueOnce({
			post: postSpy
		});

		const email = 'antman@email.com';
		const body = 'ant man suit. honestly I don\'t like it';
		const name = 'Scott Lang';
		const subject = 'Captain let me in...you remember me? from the airport?';

		await mailJetLib({ email, body, name, subject });
		expect(mailJetSpy).toHaveBeenCalledWith('username', 'password');
		expect(postSpy).toBeCalledWith('send', { version: 'v3.1' });
		expect(requestSpy).toBeCalledWith({
			Messages: [{
				From: {
					Email: 'app@email.com',
					Name: 'Facebook Mini API'
				},
				To: [{
					Email: email,
					Name: name
				}],
				Subject: subject,
				TextPart: body,
				HTMLPart: body,
			}]
		});

	});
});