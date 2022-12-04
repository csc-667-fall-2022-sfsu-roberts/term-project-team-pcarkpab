const express = require('express');
const router = express.Router();

/* GET page. */
router.get('/', function(req, res, next) {
    res.render("authenticated/howtoplay_auth", {title:"How to Play Page (Auth)"});
  });


module.exports = router;