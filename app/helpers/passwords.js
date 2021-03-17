const bcrypt = require('bcrypt')
const saltRounds = 10;
 
async function hash(password) {
  return await bcrypt.hash(password, saltRounds);
}

exports.hash = hash;

  