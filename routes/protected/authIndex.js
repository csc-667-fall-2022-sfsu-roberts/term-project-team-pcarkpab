const express = require('express');
const router = express.Router();


router.get('/waitingRoom', function(req, res, next) {
  res.render("authenticated/waitingRoom", {title:"Waiting Room Page"});
});

router.get('/settings', function(req, res, next) {
  res.render("authenticated/settings", {title:"User settings Page"});
});

router.get('/lobby', function(req, res, next) {
  const {username, userId} = req.session;
  res.render("authenticated/lobby", {title:"Lobby Page", username, userId});
});

router.get('/howtoplay_auth', function(req, res, next) {
  res.render("authenticated/howtoplay_auth", {title:"How to Play Page (Auth)"});
});

router.get('/addPayment', function(req, res, next) {
  res.render("authenticated/addPayment", {title:"Add Payment Page"});
});


module.exports = router;