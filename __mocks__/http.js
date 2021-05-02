exports.mockResponse = () => {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	res.data = jest.fn().mockReturnValue(res);
	res.error = jest.fn().mockReturnValue(res);
	res.errorMessage = jest.fn().mockReturnValue(res);
	return res;
};

exports.mockRequest = ({
	body = {},
	params = {},
	user = {},
	query = {},
	headers = {},
	file = {},
	method,
	loginID,
	originalUrl,
} = {}) => ({
	body,
	params,
	user,
	method,
	originalUrl,
	headers,
	loginID,
	query,
	file,
	get: (arg) => headers[arg],
});

exports.mockNext = () => {};
