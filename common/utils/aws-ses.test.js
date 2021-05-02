process.env = {
	AWS_ACCESS_KEY_ID: 'access_key',
	AWS_SECRET_ACCESS_KEY: 'secret_access-key',
	MAIL_SENDER: 'nickfury@avengers.com'
};

const AWS = require('aws-sdk'); 
const awsSES = require('./aws-ses');
// jest.mock('./aws-ses');

describe('AWS SES Mailer Utility', () => {
	it('Can send mail', () => {
		const email = 'rhoddy@avengers.com';
		const subject = 'avengers! assemble';
		const body = '<h1>check the damn title.</h1>';
		const mailSender = 'nickfury@avengers.com';

		const promiseSpy = jest.fn().mockReturnValue('stuff');
		const sendMailSpy = jest.fn().mockReturnValue({ promise: promiseSpy });
		const sesSpy = jest.spyOn(AWS, 'SES').mockReturnValue({ sendEmail: sendMailSpy });
		const result = awsSES({ email, subject, body });

		expect(result).toEqual('stuff');
		expect(sesSpy).toBeCalledWith({
			apiVersion: '2010-12-01'
		});
		expect(sendMailSpy).toBeCalledWith({
			Destination: {
				ToAddresses: [
					email,
				]
			},
			Message: {
				Body: {
					Html: {
						Charset: 'UTF-8',
						Data: body
					},
					Text: {
						Charset: 'UTF-8',
						Data: 'check the damn title.'
					}
				},
				Subject: {
					Charset: 'UTF-8',
					Data: subject
				}
			},
			Source: mailSender,
			ReplyToAddresses: [
				mailSender
			],
		});
		expect(promiseSpy).toBeCalled();
	});
});