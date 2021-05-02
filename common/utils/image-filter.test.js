
const imageFilter = require('./image-filter');

describe('Image file utility', () => {
	it('rejects files that are not images', () => {
		const req = {};
		const file = { mimetype: 'Application/json', fieldname: 'abacus' };
		const cb = jest.fn();

		imageFilter(req, file, cb);

		expect(cb).toBeCalledWith('abacus only supports image file upload');
	});

	it('accept files that are images', () => {
		const req = {};
		const file = { mimetype: 'image/jpg' };
		const cb = jest.fn();

		imageFilter(req, file, cb);

		expect(cb).toBeCalledWith(null, true);
	});
});