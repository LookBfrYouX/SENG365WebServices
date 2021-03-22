const bcrypt = require('bcrypt')
const saltRounds = 10;

exports.hash = async function(password) {
  return await bcrypt.hash(password, saltRounds);
};

exports.compareHash = async function (user, original) {
    return await bcrypt.compare(user, original);
};
