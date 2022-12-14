const Games = require('../Games');

const check = (userId, gameId) => {

  return Games.setPlayerStatus(userId, gameId, 'CHECK')
    .then(() => {
      //Set dealer status as well
      return Games.setPlayerStatus(0, gameId, 'CHECK');
    })
    .then(() => {
      //Update dealer current bet
      return Games.setPlayerBet(0, gameId, '0');
    })
}

module.exports = check;