const Games = require('../Games');

const nextTurn = (userId, gameId, betAmount) => {
  return Games.setPlayerTurn();
}


module.exports = nextTurn;