const express = require('express');
const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("unauthenticated/home", {title:"HOME PAGE"});
});

router.get('/login', function (req, res, next) {
  res.render("unauthenticated/login", {title:"Login Page"});
});

router.get('/loginAfterSignup', function (req, res, next) {
  res.render("unauthenticated/loginAfterSignup", {title:"Login Page"});
});

router.get('/signup', function (req, res, next) {
  res.render("unauthenticated/signup", {title:"Sign up Page"});
});

router.get('/howtoplay', function (req, res, next) {
  res.render("unauthenticated/howtoplay", {title:"How to Play Page"});
});

router.get('/about', function (req, res, next) {
  res.render("unauthenticated/about", {title:"About Page"});
});





module.exports = router;


