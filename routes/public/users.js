const express = require('express');
const Users = require('../../db/Users');
const router = express.Router();

router.get('/', function (req, res, next) {
  res.send("Users route reached\n");
})

router.post('/login', function (req, res, next) {
  const {username, password} = req.body;
  Users.login({username, password})
    .then((userId) => {
      if(userId > 0){
        req.session.authenticated = true;
        req.session.username = username;
        req.session.userId = userId;

        res.redirect("/lobby");
      }else{
        throw Error("Username or Password is invalid! Please try again");
      }  
    })
    .catch((err) => {
      //implement flash messages
      console.log("LOGIN ERROR: " + err);
      res.redirect("/login");
    });
});

router.post('/register', function (req, res, next) {
  const {username, email, password} = req.body;
  console.log("Im in register post request\n");
  
  Users.checkUsername(username)
    .then((exists) => {
      if(exists){
        throw Error("Username already exists");
      }else{
        return Users.register({username, email, password});
      }
    })
    .then((result) => { 
      console.log(result);
      req.session.authenticated = true;
      req.session.username = result.username;
      req.session.userId = result.userId;

      res.redirect("/lobby");
    })
    .catch((err) => {
      //implement flash messages
      console.log(err);
      res.redirect("/signup");
    });
});

router.get("/logout", (req,res,next)=>{
  req.session.destroy((err) =>{
    if(err){
      next(err);
    }else{
      res.clearCookie('sid');
      res.redirect('/');
    }
  })
});

module.exports = router;