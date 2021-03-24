const rand = require('randomstring')
const password= require('../helpers/passwords')

exports.generateAuth = async function() {
  return await password.hash(rand.generate(10));
};
