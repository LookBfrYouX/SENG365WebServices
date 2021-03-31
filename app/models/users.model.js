db = require('../../config/db')
// ssh nbt25@linux.cosc.canterbury.ac.nz -L 3306:db2.csse.canterbury.ac.nz:3306 -N
exports.checkEmailExists = async function(email) {
  try {
    const conn = await db.getPool().getConnection();
    const query = `SELECT email
                 FROM user
                 WHERE email = ?`;
		const [ rows ] = await conn.query( query, [email] );
	  conn.release();
	  return (rows.length > 0);
	} catch (err) {
    console.log(err);
    throw err;
	}
};

exports.addUser = async function(user, userPassword) {
  try {
    const conn = await db.getPool().getConnection();
    const query = 'INSERT INTO `user` (`email`, `first_name`, `last_name`, `image_filename`, `password`) VALUES (?)'
		await conn.query( query, [[user.email, user.firstName, user.lastName, null, userPassword]]);
    const result = await this.searchUserBy(`email = '${user.email}'`);
    userId = result[0].userId;
    conn.release();
    return userId;
	} catch (err) {
		console.log(err);
		throw err;
	}
}
exports.searchUserBy = async function(searchParam) {
  try {
    const conn = await db.getPool().getConnection();
    let query = `SELECT id as userId, first_name as firstName,
												last_name as lastName, email, auth_token as authToken,
												image_filename as imageFilename, password, image_filename
                 FROM user
                 WHERE `;
    query += searchParam;
		const [ rows ] = await conn.query( query );
	  conn.release();
	 	return rows;
	} catch (err) {
		console.log(err);
		throw err;
	}
}

exports.updateUserByID = async function(params, id) {
  try {
    const conn = await db.getPool().getConnection();
    const query = 'UPDATE user SET ' + params + 'WHERE id = ?'
    console.log(query);
    await conn.query( query, [id] );
    conn.release();
  } catch (err) {
    console.log(err);
    throw err;
  }
}

exports.setAuthToken = async function(token, email) {
  try {
    const conn = await db.getPool().getConnection();
    const query = `UPDATE user SET user.auth_token = ? WHERE user.email = ?;`;
		await conn.query( query, [token, email] );
	  conn.release();
	} catch (err) {
		console.log(err);
		throw err;
	}
}

exports.deleteAuthToken = async function(email) {
  try {
    const conn = await db.getPool().getConnection();
    const query = `UPDATE user
                  SET user.auth_token = NULL
                  WHERE user.email = ?
                  `
		await conn.query( query, [email] );
	  conn.release();
	} catch (err) {
		console.log(err);
		throw err;
	}
}
