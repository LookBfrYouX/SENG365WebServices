users = require('../models/users.model')
password = require ('../helpers/passwords')
generateToken = require ('../helpers/token')
auth = require ('../middleware/authorize.middleware')
number = require ('is-number')

//Works
exports.register = async function(req, res) {
  user = req.body;
  userPassword = await password.hash(user.password);
  try {
    const emailCheck = await users.checkEmailExists(user.email);
    if (emailCheck === false && user.email.includes('@')) {
      userId = await users.addUser(user, userPassword);
      res.statusMessage = 'Created';
        res.status(201)
        .json({userId:userId});

    } else {
      res.statusMessage = 'Bad Request';
        res.status(400)
           .send()
      }
    } catch(err) {
      console.log(err)
      res.statusMessage = 'Server Error';
        res.status(500)
           .send()
  }
};
//works
exports.login = async function(req, res) {
  const emailReq = req.body.email;
  const passwordReq = req.body.password;
  try {
    if ((await users.searchUserBy(`email = '${emailReq}'`))[0]) {
      const user = (await users.searchUserBy(`email = '${emailReq}'`))[0]
      if (await password.compareHash(passwordReq, user.password)) {
        const token = await generateToken.generateAuth();
        await users.setAuthToken(token, emailReq);
        res.statusMessage = 'OK';
        res.status(200)
           .json({userId:user.userId, token:`${token}`});
      } else {
        res.statusMessage = 'Bad Request';
        res.status(400)
           .send();
      }
    } else {
      res.statusMessage = 'Bad Request';
      res.status(400)
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
  const userID = req.params.id
  const user = (await users.searchUserBy(`id = ${userID}`))[0];
  await auth.Authorized(req, res)
  if (req.authenticatedUserId === parseInt(userID)) {
    res.statusMessage = 'OK';
    res.status(200)
       .json({firstName:`${user.firstName}`, lastName:`${user.lastName}`, email:`${user.email}`});
  } else if (!user) {
    res.statusMessage = 'Not Found';
    res.status(404)
       .send();
  } else {
    res.statusMessage = 'OK';
    res.status(200)
       .json({firstName:`${user.firstName}`, lastName:`${user.lastName}`});
    }
  };
// works now (need to do more testing for changing email and stuff)
exports.edit = async function(req, res) {
  const userID = req.params.id;
  var query = '';
  // if Authorized / logged in
  try {
    const user = await users.searchUserBy(`id = ${userID}`);
    console.log(user)
    if (!isNaN(parseInt(userID)) && user.length != 0) {
      if (await auth.Authorized(req, res)) {
        console.log('anything')
        if (req.authenticatedUserId == parseInt(userID)) {
          // can edit user
          if (req.body.firstName) {
            query += `first_name = '${req.body.firstName}', `;
          } if (req.body.lastName) {
            query += `last_name = '${req.body.lastName}', `;
          } if (req.body.email) {
            if (await users.checkEmailExists(req.body.email) || !req.body.email.includes('@')) {
              res.statusMessage = 'Bad Request';
              res.status(400)
                 .send();
            } else {
              query += `email = '${req.body.email}', `;
            }

          } if (req.body.password) {
            // if currentPassword is included
            if (req.body.currentPassword) {
              const passwordReq = req.body.currentPassword;
              console.log(passwordReq);
              if (await password.compareHash(passwordReq, user[0].password)) {
                newHashedPassword = await password.hash(req.body.password)
                query += `password = '${newHashedPassword}', `;
              } else {
                res.statusMessage = 'Forbidden';
                res.status(403)
                   .send();
                }
            } else {
              res.statusMessage = 'Bad Request';
              res.status(400)
                 .send();
              }
          }
          if (!query) {
            res.statusMessage = 'OK';
            res.status(200)
               .send();
          } else {
            query = query.slice(0,-2);
            query += ' '
            await users.updateUserByID(query, parseInt(userID));
            res.statusMessage = 'OK';
            res.status(200)
               .send();
          }
        } else {
          res.statusMessage = 'Forbidden';
          res.status(403)
             .send();
          }
      } else {
        console.log('Unauthorized')
        res.statusMessage = 'Unauthorized';
        res.status(401)
           .send();
      }

    } else {
      res.statusMessage = 'Not Found';
      res.status(404)
         .send();
    }
  } catch (err) {
    console.log(err);
    res.statusMessage = 'Internal Server Error';
    res.status(500)
       .send();
  }
};
