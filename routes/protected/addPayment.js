const express = require('express');
const router = express.Router();

/* GET page. */
router.get('/', function(req, res, next) {
    res.render("authenticated/addPayment", {title:"Add Payment Page"});
  });


module.exports = router;