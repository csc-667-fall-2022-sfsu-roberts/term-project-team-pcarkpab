const express = require('express');
const GameLogic = require('../../../db/game-logic/index');
const Games = require('../../../db/Games');
const Users = require('../../../db/Users');
const router = express.Router();

router.post('/', (req, res, next) => {
  console.log("YO");
  res.json({success: true});
})

router.post('/initialize/:id', (req, res, next) =>{
  const {id: gameId} = req.params;

  GameLogic.initialize(gameId)
    .then(() => {
      console.log("GAME INITIALIZED");
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
      console.log("Game data updated");
      req.app.io.emit(`update-gameData:${gameId}`, {data});
      res.json({success: true});
    })
    .catch(err => console.log(err));
})

router.get('/getData/:id', (req, res, next) => {
  const {id: gameId} = req.params;
  GameLogic.getData(gameId)
    .then((data) => {
      res.json(data);
    })
    .catch(err => console.log(err));
})


router.post('/phaseBlindBet/:id', (req, res, next) => {
  
  const {id: gameId} = req.params;
  Games.setGamePhase(gameId, 'BLINDBET')
  .then(() => {
    return GameLogic.getData(gameId);
  })
  .then((results) => {
    for (let player of results.playerInfo) {
      if (player.blindStatus === 'DEALER') {
        return Promise.resolve(player.seatNumber);
      }
    }
  })
  .then((seatNumber) => {
    return GameLogic.nextTurn(gameId, seatNumber);
  })
  .then((result) => {
    console.log("blind bet phase");
    req.app.io.emit(`phase-blindBet:${gameId}`, {});
    res.json({success: true});
  })
  .catch(err => console.log(err));
})

//phaseAssignCards/${gameId}
router.post('/phaseAssignCards/:id', (req, res, next) => {
  
  const {id: gameId} = req.params;
  Games.setGamePhase(gameId, 'ASSIGNCARDS')
  .then(() => {
    return GameLogic.assignCards(gameId);
  })
  .then(() => {
    return GameLogic.getData(gameId);
  })
  .then((result) => {
    console.log("Assign card phase");
    req.app.io.emit(`phase-assignCards:${gameId}`, {});
    res.json({success: true});
  })
  .catch(err => console.log(err));
})



router.post('/phasePreFlop/:id', (req, res, next) => {
  const {id: gameId} = req.params;
  Games.setGamePhase(gameId, 'PREFLOP')
  .then(() => {
    res.json({success: true});
  })
  .catch((err) => console.log(err)); 
})

router.post('/phaseFlop/:id', (req, res, next) => {
  const {id: gameId} = req.params;
  
  GameLogic.phaseFlop(gameId)
  .then(() => {
    console.log("phase Flop");
    req.app.io.emit(`phase-flop:${gameId}`, {});
    res.json({success: true});
  })
})

router.post('/phaseTurn/:id', (req, res, next) => {
  const {id: gameId} = req.params;
  GameLogic.phaseTurn(gameId)
  .then(() => {
    console.log("phase Turn");
    req.app.io.emit(`phase-turn:${gameId}`, {});
    res.json({success: true});
  })
})

router.post('/phaseRiver/:id', (req, res, next) => {
  const {id: gameId} = req.params;
  GameLogic.phaseRiver(gameId)
  .then(() => {
    console.log("phase River");
    req.app.io.emit(`phase-river:${gameId}`, {});
    res.json({success: true});
  })
})

router.post('/phaseFinal/:id', (req, res, next) => {
  const {id: gameId} = req.params;
  Games.setGamePhase(gameId, 'FINALREVEAL')
  .then(() => {
    console.log("phase Final");
    req.app.io.emit(`phase-final:${gameId}`, {});
    res.json({success: true});
  })

})

router.get('/getWinner/:id', (req, res, next) => {
  const {id: gameId} = req.params;
  let userId;
  //TODO
  GameLogic.getWinner(gameId)
  .then((result) => {
    res.json(result);
  })
})

router.post('/checkWinner/:id', (req, res, next) => {
  const {id: gameId} = req.params;

  //TODO
  GameLogic.getWinner(gameId)
  .then((result) => {
    console.log(result);
    if(result.won){
      //CHANGE TO GAMEEND
      Games.setGamePhase(gameId, 'FINALREVEAL')
      .then(() => {
        for(let announcement of result.announcement){
          req.app.io.emit(`console:${gameId}`, {
            sender: announcement.username,
            message: `${announcement.username} ${announcement.hand}`,
            timestamp: Date.now()
          })
        }

        for(let winner of result.winners){
          req.app.io.emit(`console:${gameId}`, {
            sender: winner.username,
            message: `${winner.username} has won!!!`,
            timestamp: Date.now()
          })
        }
        
        //req.app.io.emit(`winner:${gameId}`, {username: result.username, userId});
        res.json({success: true});
      })
    }else{
      res.json({success: false});
    }
  })
  .catch(err => console.log(err));
  
})

router.get('/getData/:id', (req, res, next) => {
  const {id: gameId} = req.params;
  GameLogic.getData(gameId)
    .then((data) => {
      res.json(data);
    })
    .catch(err => console.log(err));
})

router.post('/playerBet/:id', (req, res, next) => {
  const {id: gameId} = req.params;
  const {userId, betAmount} = req.body;
  const username = req.session.username;
  
  GameLogic.bet(userId, gameId, betAmount)
    .then(() => {
      console.log(userId + " has bet " + betAmount);
      req.app.io.emit(`console:${gameId}`, {
        sender: username,
        message: `${username} has bet ${betAmount}$`,
        timestamp: Date.now()
      })
      res.json({success: true});
    })
    .catch(err => console.log(err));
})

router.post('/playerCheck/:id', (req, res, next) => {
  const {id: gameId} = req.params;
  const {userId} = req.body;
  const username = req.session.username;
  
  GameLogic.check(userId, gameId)
    .then(() => {
      console.log(userId + " has checked");
      req.app.io.emit(`console:${gameId}`, {
        sender: username,
        message: `${username} has checked`,
        timestamp: Date.now()
      })
      res.json({success: true});
    })
    .catch(err => console.log(err));
})

router.post('/playerFold/:id', (req, res, next) => {
  const {id: gameId} = req.params;
  const {userId} = req.body;
  const username = req.session.username;
  
  GameLogic.fold(userId, gameId)
    .then(() => {
      console.log(userId + " has folded");
      req.app.io.emit(`console:${gameId}`, {
        sender: username,
        message: `${username} has folded`,
        timestamp: Date.now()
      })
      res.json({success: true});
    })
    .catch(err => console.log(err));
})



router.post('/nextTurn/:id', (req, res, next) => {
  const {id: gameId} = req.params;
  const {isTurn} = req.body;

  GameLogic.nextTurn(gameId, isTurn)
    .then(() => {   
      res.json({success: true});
    })

})

module.exports = router;

