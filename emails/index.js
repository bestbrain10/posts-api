const mailJet = require('../common/utils/mailjet');
const fs = require('fs');
const ejs = require('ejs');

module.exports = async ({ data, email, subject, template, name }) => {
	const path = `emails/templates/${template}.ejs`;
	if(!fs.existsSync(path)) {
		throw `Template ${template} does not exist`;
	}        

	try {
		const body = await ejs.renderFile(`emails/templates/${template}.ejs`, {
			...process.env,
			...data
		});
		await mailJet({
			body,
			email,
			subject,
			name
		});
	} catch(e) {
		// eslint-disable-next-line no-console
		console.log('Mail Error');
		// eslint-disable-next-line no-console
		console.log(e);
	}
};
