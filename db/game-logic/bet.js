const Games = require('../Games');

const bet = (userId, gameId, betAmount) => {
  return Games.addPlayerBet(userId, gameId, betAmount)
    .then(() => {
      return Games.deducePlayerMoney(userId, gameId, betAmount);
    })
    .then(() => {
      return Games.addGamePot(gameId, betAmount);
    })
    .then(() => {
      return Games.setPlayerStatus(userId, gameId, 'BET');
    })
    .then(() => {
      //Set dealer status as well
      return Games.setPlayerStatus(0, gameId, 'BET');
    })
    .then(() => {
      return Games.getPlayerData(userId, gameId);
    }
    )
    .then((playerData) => {
      return Games.getPlayerData(0, gameId)
        .then((dealer) => {
          console.log("BET");
          console.log(playerData.chipsBet + ", " + dealer.chipsBet);
          if(playerData.chipsBet > dealer.chipsBet){
            //Update dealer current bet
            return Games.setPlayerBet(0, gameId, playerData.chipsBet);
          }
        })
      
    })
}

module.exports = bet;