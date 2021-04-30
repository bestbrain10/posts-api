require('dotenv').config();

const database = require('./database');

const server = require('./server');
database.authenticate()
	.then(() => {
		server.listen(parseInt(process.env.PORT), () => {
			// eslint-disable-next-line no-console
			console.log(`Application Started on port ${process.env.PORT}`);
		});
	})
	.catch(e => {
		// eslint-disable-next-line no-console
		console.log('Database connection failed');
		// eslint-disable-next-line no-console
		console.log(e);
		process.exit(1);
	});