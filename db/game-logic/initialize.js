const Games = require('../Games');
const Lobby = require('../Lobby');

const initialize = (gameId) => {
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
    .then(async (players) => {
      let i = 0;
      playerCount = players.length;
      for (let player of players) {

        try {
          await Games.setPlayerDefault(player.userId, gameId);

          await Games.assignPlayerSeat(player.userId, gameId, i);

          if (i == 0) {

            i++;
            await Games.setPlayerBlindStatus(player.userId, gameId, 'DEALER');
          } else if (i == 2 || playerCount == 2) {
            i++;
            await Games.setPlayerBlindStatus(player.userId, gameId, 'BIGBLIND');
          } else if (i == 1) {
            i++;
            await Games.setPlayerBlindStatus(player.userId, gameId, 'SMALLBLIND');
          } else {
            i++;
          }
        } catch (err) {
          console.log(err);
        }
      }
    })
    .then(() => {
      return Promise.resolve(gameId);
    })
    .catch(err => console.log(err));

}

module.exports = initialize;