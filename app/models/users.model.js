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
	} catch {

	}
};

exports.addUser = async function(user) {
  const conn = await db.getPool().getConnection();
  const query = `INSERT INTO user ?`
  try {
		const [rows] = await conn.query( query, [user] )
		result = searchUserBy()
		return
	} catch (err) {
		console.log(err)
		throw err
	}
}
exports.seachUserBy = async function(searchParam) {
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
		console.log(err)
		throw err
	}
}
