const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("authenticated/lobby", {title:"Lobby Page"});
});


module.exports = router;