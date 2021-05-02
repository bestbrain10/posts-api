const { MAIL_SENDER: mailSender, REGION } = process.env;

const AWS = require('aws-sdk');
AWS.config.update({region: REGION });


module.exports = ({ email, subject, body }) => {
	return new AWS.SES({
		apiVersion: '2010-12-01'
	}).sendEmail({
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
					Data: body.replace(/(<([^>]+)>)/gi, '')
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
	}).promise();
};
