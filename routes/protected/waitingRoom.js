const express = require('express');
const router = express.Router();

/* GET page. */
router.get('/', function(req, res, next) {
    res.render("authenticated/waitingRoom", {title:"Waiting Room Page"});
  });

module.exports = router;