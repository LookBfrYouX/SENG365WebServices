db = require('../../config/db')

exports.checkEmailExists = async function(email) {
  const conn = await db.getPool().getConnection();
  const query = `SELECT email
                 FROM user
                 WHERE email = ?`;
	try {
		const [ rows ] = await conn.query( query, [email] );
	  conn.release();
	  return (rows.length > 0);
	} catch (err){
    console.log(err);
    throw err;
	}
};

exports.addUser = async function(user) {
  const conn = await db.getPool().getConnection();
  const query = `INSERT INTO user ?`
  try {
		await conn.query( query, [user] );
    const result = searchUserBy(`email = ${user.email}`);
    userId = result[0].userId;
    conn.release();
    return userId;
	} catch (err) {
		console.log(err);
		throw err;
	}
}
exports.searchUserBy = async function(searchParam) {
  const conn = await db.getPool().getConnection();
  const query = `SELECT id as userId, first_name as firstName,
												last_name as lastName, email, auth_token as authToken,
												image_filename as imageFilename, password
                 FROM user
                 WHERE ?;`
	try {
		const [ rows ] = await conn.query( query, [searchParam] );
	  conn.release();
	 	return rows;
	} catch (err) {
		console.log(err);
		throw err;
	}
}

exports.setAuthToken = async function(token, email) {
  const conn = await db.getPool().getConnection();
  const query = `UPDATE user
                 SET user.auth_token = ?
                 WHERE user.email = ?
                `
	try {
		await conn.query( query, [token, email] );
	  conn.release();
	} catch (err) {
		console.log(err);
		throw err;
	}
}
