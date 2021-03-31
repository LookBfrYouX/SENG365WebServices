users = require('../models/users.model')

exports.Authorized = async function (req, res) {
    const token = req.header('X-Authorization');
    try {
      const user = await users.searchUserBy(`auth_token = '${token}'`);
      if (user.length===0) {
        return false
      } else {
        req.authenticatedUserId = user[0].userId;
        return true
      }
    } catch(err) {
      console.log(err);
      res.status(500)
         .send('Internal Server Error')
    }
}
