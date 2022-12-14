const Games = require('../Games');

const bet = (userId, gameId, betAmount) => {
  return Games.setPlayerBet(userId, gameId, betAmount)
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
      return Games.setPlayerBet(0, gameId, betAmount);
    })
}


module.exports = bet;