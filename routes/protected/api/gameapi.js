const express = require('express');
const Game = require('../../../db/game-logic/index');
const router = express.Router();

router.post('/start/:id', (req, res, next) =>{
  const {id: gameId} = req.params;

  return Game.initialize(gameId);
})


router.get('/getData/:id', (req, res, next) => {
  const {id: gameId} = req.params;
  const userId = req.session.userId;
  return Game.getData(userId, gameId)
    .then((data) => {
      res.json(data);
    })
    .catch(err => console.log(err));
  
})

module.exports = router;

