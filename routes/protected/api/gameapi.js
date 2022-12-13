const express = require('express');
const GameLogic = require('../../../db/game-logic/index');
const Games = require('../../../db/Games');
const router = express.Router();

router.post('/initialize/:id', (req, res, next) =>{
  const {id: gameId} = req.params;

  GameLogic.initialize(gameId)
    .then(() => {
      res.json({success: true});
    })
    .catch(err => console.log(err));
    
})

router.post('/start/:id', (req, res, next) =>{
  const {id: gameId} = req.params;
  console.log("GAME START");
  Games.setGameStatus(gameId, 'INGAME');
  req.app.io.emit(`game-start:${gameId}`, {});
  res.json({success: true});
})

router.post('/updateData/:id', (req, res, next) => {
  const {id: gameId} = req.params;
  GameLogic.getData(gameId)
    .then((data) => {
      req.app.io.emit(`update-gameData:${gameId}`, {data});
    })
    .catch(err => console.log(err));
})

// router.get('/getData/:id', (req, res, next) => {
//   const {id: gameId} = req.params;
//   GameLogic.getData(gameId)
//     .then((data) => {
//       res.json(data);
//     })
//     .catch(err => console.log(err));
// })

module.exports = router;

