const util = require('util');
const crypto = require('crypto');

const randomBytes = util.promisify(crypto.randomBytes);

const generateToken = async (bytes) => {
  const tokenBuf = await randomBytes(bytes);

  return tokenBuf.toString('hex');
};


module.exports = generateToken;
