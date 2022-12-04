const db = require('./database');
const bcrypt = require('bcrypt');

const login = ({username, password}) => {
  let baseSQL = 
  "SELECT \"userId\", username, password FROM users WHERE username=${username};"
  return db.one(baseSQL, {username, password})
    .then((result) => {
      if(bcrypt.compare(password, result.password)){
        return {valid: true, userId: result.userId, username: result.username};
      }
    });
}

const register = ({username, email, password}) => {
  console.log("WHAT " + username + " " + email);
  let baseSQL = 
  "INSERT INTO users (username, email, password, \"globalMoney\") VALUES (${username}, ${email}, ${hashedPassword}, 500) RETURNING username, \"userId\";"

  return bcrypt.hash(password, 12)
  .then((hashedPassword) => {
    return db.one(baseSQL, {username, email, hashedPassword})
  });
}

module.exports = {login, register};