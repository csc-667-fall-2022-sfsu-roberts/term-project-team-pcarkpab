const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("unauthenticated/home", {title:"HOME PAGE"});
});

router.get('/login', function (req, res, next) {
  res.render("unauthenticated/login", {title:"Login Page"});
});
router.get('/signup', function (req, res, next) {
  res.render("unauthenticated/signup", {title:"Sign up Page"});
});

module.exports = router;
