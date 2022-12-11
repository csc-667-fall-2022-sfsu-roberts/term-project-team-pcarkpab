const express = require('express');
const Lobby = require('../../db/Lobby');
const router = express.Router();

router.post("/create", (req, res, next) =>{
  let minimumBet = req.body.minimumBet;
  let gamePassword = req.body.gamePassword;
  let username = req.session.username;

  Lobby.create(username, minimumBet, gamePassword)
    .then((result) => {
      console.log(result);
      res.sendStatus(200);
    })
    .catch(err => console.log(err));
})

router.get("/list", (req, res, next) => {
  Lobby.list()
    .then((result) => {
      res.send(result);
    })
    .catch(err => console.log(err));
})

module.exports = router;