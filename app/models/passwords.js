const bcrypt = require 'bcrypt'
const saltRounds = 10;
 
function hash(password) {
  return bcrypt.hash(password, saltRounds, function(err, hash));
}

passwords.exports.hash = hash;

  