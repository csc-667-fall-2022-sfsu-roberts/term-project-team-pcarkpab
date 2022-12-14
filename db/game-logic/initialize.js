const Game = require('../Games');
const Lobby = require('../Lobby');

const initialize = (gameId) => {
  //I
  let playerCount;
  return Game.setGameStatus(gameId, 'INGAME')
    .then(() => {
      return Game.setGamePhase(gameId, 'PREGAME');
    })
    .then(() => {
      //Add the dealer
      return Lobby.addPlayer(0, gameId);
    })
    .then(() => {
      return Game.initializeGameDeck(gameId);
    })
    .then(() => {
      return Game.shuffleDeck(gameId);
    })
    .then(() => {
      return Game.getAllPlayersData(gameId);
    })
    .then((players) => {
      let i = 0;
      playerCount = players.length;
      return Promise.all(players.map((player) => {
        return Game.setPlayerDefault(player.userId, gameId)
          .then(() => {
            return Game.assignPlayerSeat(player.userId, gameId, i);
          })
          .then(() => {
            if (i == 0) {
              Game.setPlayerBlindStatus(player.userId, gameId, 'DEALER');
            } else if (i == 2 || playerCount == 2) {
              Game.setPlayerBlindStatus(player.userId, gameId, 'BIGBLIND');
            } else if (i == 1) {
              Game.setPlayerBlindStatus(player.userId, gameId, 'SMALLBLIND');
            }
            i++;
            return Promise.resolve();
          })
          .catch(err => console.log(err));
      }))
    })
    .then(() => {
      return Promise.resolve(gameId);
    })
    .catch(err => console.log(err));

}

module.exports = initialize;