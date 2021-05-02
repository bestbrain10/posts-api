
module.exports = (req, file, cb) => {
	if (file.mimetype.includes('image')) {
		cb(null, true);
	} else {
		cb(`${file.fieldname} only supports image file upload`);
	}
};
