const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("home", {title:"HOME PAGE"});
});

router.get('/login', function (req, res, next) {
  res.render("login", {title:"Login Page"});
})

module.exports = router;
