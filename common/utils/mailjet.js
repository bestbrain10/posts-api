
const { MAIL_SENDER: mailSender, SMTP_USERNAME, SMTP_PASSWORD } = process.env;
const mailjet = require('node-mailjet');
module.exports = ({ email, name, subject, body }) =>  {
	return mailjet.connect(SMTP_USERNAME, SMTP_PASSWORD)
		.post('send', {
			version: 'v3.1'
		})
		.request({
			Messages: [{
				From: {
					Email: mailSender,
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
};