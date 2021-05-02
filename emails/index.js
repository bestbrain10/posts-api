const mailClient = require('../common/utils/aws-ses');
const fs = require('fs');
const ejs = require('ejs');

module.exports = async ({ data, email, subject, template, name }) => {
	const path = `emails/templates/${template}.ejs`;
	if(!fs.existsSync(path)) {
		throw `Template ${template} does not exist`;
	}        

	const body = await ejs.renderFile(`emails/templates/${template}.ejs`, {
		...process.env,
		...data
	});

	if (!['ci', 'test'].includes(process.env.NODE_ENV)) {
		mailClient({
			body,
			email,
			subject,
			name
		}).catch(e => {
			// eslint-disable-next-line no-console
			console.log('Mail error');
			// eslint-disable-next-line no-console
			console.log(e);
		});
	}
};
