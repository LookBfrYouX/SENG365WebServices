users = require('../models/users.model')
password = require ('../helpers/passwords')
generateToken = require ('../helpers/token')
auth = require ('../middleware/authorize.middleware')

//Works
exports.register = async function(req, res) {
  user = req.body;
  userPassword = await password.hash(user.password);
  try {
    const emailCheck = await users.checkEmailExists(user.email);
    if (emailCheck === false) {
      userId = await users.addUser(user, userPassword);
      res.statusMessage = 'Created';
        res.status(201)
        .json(userId);

    } else {
      res.statusMessage = 'Bad Request';
        res.status(400)
      }
    } catch(err) {
      console.log(err)
      res.statusMessage = 'Server Error';
        res.status(500)
  }
};
//works
exports.login = async function(req, res) {
  const emailReq = req.body.email;
  const passwordReq = req.body.password;
  console.log(passwordReq);
  try {
    const user = (await users.searchUserBy(`email = '${emailReq}'`))[0]
    console.log(user)
    if (password.compareHash(passwordReq, user.password)) {
      console.log('here')
      const token = await generateToken.generateAuth();
      await users.setAuthToken(token, emailReq);
      res.statusMessage = 'OK';
      res.status(200)
         .json({userId:user.userId, token:`${token}`});
    } else {
      res.statusMessage = 'Bad Request';
      res.status(200)
         .send();
    }
  } catch {
    res.statusMessage = 'Internal Server Error;'
    res.status(500)
       .send()
     };
  };
//works
exports.logout = async function(req, res) {
  try {
    if (await auth.Authorized(req, res)) {
      const user = await users.searchUserBy(`id = '${req.authenticatedUserId}'`)
      await users.deleteAuthToken(user.email)
      console.log('OK')
      res.statusMessage = 'OK';
      res.status(200)
         .send();
    } else {
      res.statusMessage = 'Unauthorized';
      res.status(401)
         .send()
    }
  } catch {
    res.statusMessage = 'Internal Server Error';
    res.status(500)
       .send()
    }
  };
//works
exports.view = async function(req, res) {
  const userID = req.params.id;
  const user = (await users.searchUserBy(`id = ${userID}`))[0];
  await auth.Authorized(req, res)
  console.log(req.authenticatedUserId);
  console.log(userID);
  if (req.authenticatedUserId === parseInt(userID)) {
    res.statusMessage = 'OK';
    res.status(200)
       .json({firstName:`${user.firstName}`, lastName:`${user.lastName}`, email:`${user.email}`});
  } else if (user.length === 0) {
    res.statusMessage = 'Not Found';
    res.status(400)
       .send();
  } else {
    res.statusMessage = 'OK';
    res.status(200)
       .json({firstName:`${user.firstName}`, lastName:`${user.lastName}`});
    }
  };

exports.edit = async function(req, res) {
  const userID = req.params.id;
  try {
    const user = await users.searchUserBy(`id = ${userID}`)
    const passwordReq = req.body.currentPassword;
    const hashedPass = password.hash(passwordReq);
    if (password.compareHash(user.password, hashedPass)) {
      if (req.body.password)
      updateUserByID(req, userID);
      res.statusMessage = 'OK';
      res.status(200)
         .send();
    } else {
      res.statusMessage = 'Unauthorized';
      res.status(401)
         .send();
    }

  } catch {

  }



  };
