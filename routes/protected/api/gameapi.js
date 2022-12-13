const express = require('express');
const Game = require('../../../db/game-logic/index');
const router = express.Router();

router.post('/start/:id', (req, res, next) =>{
  const {id: gameId} = req.params;

  return Game.initialize(gameId);
})


module.exports = router;

router.post('/getGameData/:id', (req, res, next) => {
  
})