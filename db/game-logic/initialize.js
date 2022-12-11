const Game = require('../Games');

const initialize = (gameId) => {
  return Game.setGameStatus(gameId, 'INGAME')
    .then(() => {
      return Game.initializeGameDeck(gameId);
    })
    .then(() => {
      return Game.shuffleDeck(gameId);
    })
    ;
}

module.exports = initialize;