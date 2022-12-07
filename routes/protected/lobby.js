const express = require('express');
const Lobby = require('../../db/Lobby');
const router = express.Router();

router.post("/create", (req, res, next) =>{
  let minimumBet = req.body.minimumBet;
  let gamePassword = req.body.gamePassword;

  Lobby.create(minimumBet, gamePassword)
    .then((result) => {
      console.log(result);
      res.send(result);
    })
    .catch(err => console.log(err));
})


module.exports = router;