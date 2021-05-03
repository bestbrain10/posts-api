module.exports = function () {
	return this.get('media') && `${(process.env.API_URL || '')}/uploads/${this.get('media')}`;
};