const mediaLinkVirtual = require('./media-link-virtual');

describe('Media Link Virtual', () => {
	it('returns null if media is null', () => {
		const obj = {
			get: () => null,
			mediaLinkVirtual
		};
		const result = obj.mediaLinkVirtual();
		expect(result).toEqual(null);
	});

	it('returns media without API_URL if not set', () => {
		const obj = {
			get: () => 'stuff',
			mediaLinkVirtual
		};
		const result = obj.mediaLinkVirtual();
		expect(result).toEqual('/uploads/stuff');
	});

	it('returns media with API_URL if set', () => {
		process.env.API_URL = 'avengers.com';
		const obj = {
			get: () => 'stuff',
			mediaLinkVirtual
		};
		const result = obj.mediaLinkVirtual();
		expect(result).toEqual('avengers.com/uploads/stuff');
	});
});