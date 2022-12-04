const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("authenticated/about_auth", {title:"Game Page"});
});


module.exports = router;