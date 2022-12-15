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
        return Promise.resolve(tempUserId);
      }else{
        return Promise.resolve(-1);
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
  let baseSQL =
  "SELECT username FROM users WHERE username=${username};";
  return db.one(baseSQL, {username})
  .then((result) => {
    if(result){
      console.log("username exists");
      return Promise.resolve(true);
    }else{
      return Promise.resolve(false);
    }
  })
  .catch((err) => {Promise.resolve(false)});
}

const getUsername = (userId) => {
  let baseSQL =
  "SELECT username FROM users WHERE \"userId\"=${userId};";
  return db.one(baseSQL, {userId});
}

module.exports = {login, register, checkUsername, getUsername};