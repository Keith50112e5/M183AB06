const bcrypt = require("bcrypt");

/**
 *
 * @param {string} pw
 * @returns {Promise}*/
const password = async (pw) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(pw, salt);
};
/**
 *
 * @param {string} pw
 * @param {string} hash
 * @returns {Promise<boolean>}*/
const compare = async (pw, hash) => {
  try {
    return await bcrypt.compare(pw, hash);
  } catch (error) {
    console.log(error);
  }
  return await new Promise(false);
};
module.exports = { password, compare };
