const express = require('express');
const router = express.Router();

/* GET page. */
 router.get('/', function(req, res, next) {
    res.render("authenticated/settings", {title:"User settings Page"});
  });

module.exports = router;