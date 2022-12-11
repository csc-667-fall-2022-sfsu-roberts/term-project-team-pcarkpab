const express = require('express');
const router = express.Router();


router.get('/', function(req, res, next) {
  const {username, userId} = req.session;
  let gameId = 0;
  res.render("authenticated/game", {title:"Game Page", username, userId, gameId});
});


router.get('/:id', function(req, res, next) {
  const {username, userId} = req.session;
  const {id: gameId} = req.params;
  res.render("authenticated/game", {title:"Game Page", username, userId, gameId});
});


module.exports = router;