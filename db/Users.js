const db = require('./database');
const bcrypt = require('bcrypt');

const login = ({username, password}) => {
  let baseSQL = 
  "SELECT \"userId\", username, password FROM users WHERE username=${username};"
  let tempUserId;
 
  return db.one(baseSQL, {username})
    .then((result) => {
      if(result){
        tempUserId = result.userId;
        return bcrypt.compare(password, result.password);
      }else{
        return Promise.reject(-1);
      }
    })
    .then((passwordMatch) => {
      if(passwordMatch){
        return tempUserId;
      }else{
        return -1;
      }
    })
    .catch((err) => Promise.reject(err));
}

const register = ({username, email, password}) => {

  let baseSQL = 
  "INSERT INTO users (username, email, password, \"globalMoney\") VALUES (${username}, ${email}, ${hashedPassword}, 500) RETURNING username, \"userId\";"

  return bcrypt.hash(password, 12)
  .then((hashedPassword) => {
    return db.one(baseSQL, {username, email, hashedPassword})
  });
}

const checkUsername = (username) => {
  console.log(username);
  let baseSQL =
  "SELECT username FROM users WHERE username=${username};";
  return db.one(baseSQL, {username})
  .then((result) => {
    if(result){
      console.log("username exists");
      return true;
    }else{
      return false;
    }
  })
  .catch((err) => {Promise.resolve(false)});
}

module.exports = {login, register, checkUsername};