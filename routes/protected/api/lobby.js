const express = require('express');
const Lobby = require('../../../db/Lobby');
const router = express.Router();
const Games = require('../../../db/Games');

const MAX_PLAYER = 6;

router.post("/create", (req, res, next) => {
  let minimumBet = req.body.minimumBet;
  let username = req.session.username;
  let userId = req.session.userId;

  Lobby.create(username, minimumBet)
    .then((result) => {
      console.log(result);
      return result.gameId;
    })
    .then((gameId) => {
      Lobby.addPlayer(userId, gameId)
        .then(() => {
          req.app.io.emit("lobby:0", {
            game: gameId,
          })
          res.json({ gameId });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
})

router.get("/list", (req, res, next) => {
  Lobby.list()
    .then((result) => {
      res.json(result);
    })
    .catch(err => console.log(err));
})

router.get("/checkPlayerCount/:id", (req, res, next) => {
  const { id: gameId } = req.params;
  Lobby.checkPlayerCount(gameId)
    .then((result) => {
      res.json(result);
    })
    .catch(err => console.log(err));
})


router.post("/join/:id", (req, res, next) => {
  const { id: gameId } = req.params;
  const { userId, username } = req.session;
  let playerCount;
  //Player already in lobby/game
  Lobby.checkAlreadyInLobby(userId, gameId)
    .then((exist) => {
      if (exist) {
        return Lobby.checkPlayerCount(gameId)
          .then((result) => {
            playerCount = result.count;
            return Games.getGame(gameId)
          })
          .then((result) => {
            req.app.io.emit(`player-join:${gameId}`, {
              playerCount,
              gameStatus: result.gameStatus,
            })
            res.json({ gameId });
          })
      }
    })
    .catch((err) => {
      console.log("Expected Error: " + err.message);
      //Check if the room is full
      Lobby.checkPlayerCount(gameId)
        .then((result) => {
          playerCount = result.count + 1;
          if (result.count >= MAX_PLAYER) {
            return res.json({ gameId: -1 });
          } else {
            Lobby.addPlayer(userId, gameId)
              .then((result) => {
                req.app.io.emit("lobby:0", {
                  game: gameId,
                })
                req.app.io.emit(`console:${gameId}`, {
                  sender: username,
                  message: `${username} has joined the game`,
                  timestamp: Date.now()
                })
                return Games.getGame(gameId);
              })
              .then((result) => {
                req.app.io.emit(`player-join:${gameId}`, {
                  playerCount,
                  gameStatus: result.gameStatus,
                })
                return res.json({ gameId: result.gameId });
              })
              .catch(err => console.log(err));
          }
        })
        .catch(err => console.log(err));

    });
})

router.post("/leave/:id", (req, res, next) => {
  const { userId } = req.session;
  const { id: gameId } = req.params;
  Lobby.removePlayer(userId, gameId)
    .then(() => {
      return Lobby.checkPlayerCount(gameId);
    })
    .then((result) => {
      if (result.count == 0) {
        console.log("Lobby " + gameId + " is deleted");
        return Lobby.deleteLobby(gameId);
      } else {
        return Promise.resolve(1);
      }
    })
    .then(() => {
      req.app.io.emit("lobby:0", { gameId });
      res.json({ success: true });
    })
    .catch(err => console.log(err));
})



module.exports = router;