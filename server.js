const express = require('express');

const app = express();

const catchAllErrorsMiddleware = require('./common/middlewares/catch-all-errors.middleware');
const notFoundMiddleware = require('./common/middlewares/not-found.middleware');
const authMiddleware = require('./common/middlewares/auth.middleware');

const indexRoute = require('./common/middlewares/index.middleware');
const authRoutes = require('./auth/routes');
const userRoutes = require('./users/routes');
const postRoutes = require('./posts/routes');



const customExpress = Object.create(express().response, {
	data: {
		value(data, status = 'success') {
			return this.type('json').json({
				status,
				data,
			});
		},
	},
	error: {
		value(error, message = 'An error occured') {
			return this.json({
				message,
				status: 'error',
				error,
			});
		},
	},
	errorMessage: {
		value(message = 'API response message') {
			return this.json({
				message,
				status: 'error',
			});
		},
	},
});

app.use(express.json());
app.use(express.urlencoded({
	extended: false,
}));

app.response = Object.create(customExpress);

app.all('/', indexRoute);
app.use(authRoutes);
app.use('/users', authMiddleware, userRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/posts', authMiddleware, postRoutes);


// catch all errors middleware
app.use(catchAllErrorsMiddleware);

// 404 catch route
app.use('*', notFoundMiddleware);

module.exports = app;