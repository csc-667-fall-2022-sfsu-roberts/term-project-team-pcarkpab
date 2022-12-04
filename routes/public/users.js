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
      req.session.authenticated = true;
      req.session.username = result.username;
      req.session.userId = result.id;

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

module.exports = router;