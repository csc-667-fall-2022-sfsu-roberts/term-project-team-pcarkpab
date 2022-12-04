const db = require('./database');

const login = ({username, password}) => {
  let baseSQL = 
  `SELECT id, username
  FROM users 
  WHERE username=? AND password=?;`;
  return db.one(baseSQL, {username, password});
}

const register = ({username, email, password}) => {
  console.log("WHAT " + username + " " + email);
  let baseSQL = 
  "INSERT INTO users (username, email, password, \"globalMoney\") VALUES (${username}, ${email}, ${password}, 500) RETURNING username, \"userId\";"

  return db.one(baseSQL, {username, email, password});
}


module.exports = {login, register};