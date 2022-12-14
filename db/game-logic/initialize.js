const Games = require('../Games');
const Lobby = require('../Lobby');

const initialize = (gameId) => {
  //I
  let playerCount;
  return Games.setGameStatus(gameId, 'INGAME')
    .then(() => {
      return Games.setGamePhase(gameId, 'PREGAME');
    })
    .then(() => {
      //Add the dealer
      return Lobby.addPlayer(0, gameId);
    })
    .then(() => {
      return Games.initializeGameDeck(gameId);
    })
    .then(() => {
      return Games.shuffleDeck(gameId);
    })
    .then(() => {
      return Games.getAllPlayersData(gameId);
    })
    .then((players) => {
      let i = 0;
      playerCount = players.length;
      return Promise.all(players.map((player) => {
        return Games.setPlayerDefault(player.userId, gameId)
          .then(() => {
            return Games.assignPlayerSeat(player.userId, gameId, i);
          })
          .then(() => {
            if (i == 0) {
              Games.setPlayerBlindStatus(player.userId, gameId, 'DEALER');
            } else if (i == 2 || playerCount == 2) {
              Games.setPlayerBlindStatus(player.userId, gameId, 'BIGBLIND');
            } else if (i == 1) {
              Games.setPlayerBlindStatus(player.userId, gameId, 'SMALLBLIND');
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