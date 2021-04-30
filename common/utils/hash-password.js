const crypto = require('crypto');

module.exports = (inputString) => crypto.createHash('sha256').update(inputString).digest('hex');