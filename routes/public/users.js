const express = require('express');
const Users = require('../../db/Users');
const router = express.Router();

router.get('/', function (req, res, next) {
  res.send("Users route reached\n");
})

router.post('/login', function (req, res, next) {
  const {username, password} = req.body;

  Users.login({username, password})
    .then((result) => {
      if(!result.valid){
        alert("Incorrect Username/Password");
        res.redirect("/login");
      }
      req.session.authenticated = true;
      req.session.username = result.username;
      req.session.userId = result.userId;

      res.redirect("/lobby");
    })
    .catch((err) => {next(err)});

});

router.post('/register', function (req, res, next) {
  const {username, email, password} = req.body;
  console.log("Im in register post request\n");
  Users.register({username, email, password})
    .then((result) => { 
      console.log(result);
      req.session.authenticated = true;
      req.session.username = result.username;
      req.session.userId = result.userId;

      res.redirect("/lobby");
    })
    .catch((err) => {next(err)});
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