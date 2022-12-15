const Games = require('../Games');
const Lobby = require('../Lobby');



const newRound = async(gameId) => {
  let playerCount;
  return Games.setGameStatus(gameId, 'INGAME')
    .then(() => {
      return Games.setGamePhase(gameId, 'PREGAME');
    })
    .then(() => {
      //Add the dealer
      return Games.removeDeck(gameId);
    })
    .then(() => {
      return Games.initializeGameDeck(gameId);
    })
    .then(() => {
      return Games.shuffleDeck(gameId);
    })
    .then(() => {
      //Clear the isTurn game data
      return Games.setPlayerTurn(-1, gameId);
    })
    .then(() => {
      return Games.getAllPlayersData(gameId);
    })
    .then(async (players) => {
      let i = 0;
      playerCount = players.length;
      //Set dealer to default
      await Games.setPlayerDefault(0, gameId);
      await Games.setGamePot(gameId, 0);

      for (let player of players) {
          await Games.setPlayerDefault(player.userId, gameId);
          await Games.assignPlayerSeat(player.userId, gameId, i);
          i++;  
      }
      let dealerButton = generateRandomNumber(0, players.length - 1);
      //SET DEALER
      console.log('SET DEALER ' + dealerButton);
      await Games.setPlayerBlindStatus(players[dealerButton].userId, gameId, 'DEALER');
      if(dealerButton == playerCount - 1){
        dealerButton = 0;
      }else{
        dealerButton++;
      }
      //SET SMALL BLIND
      if(playerCount > 2){
        await Games.setPlayerBlindStatus(players[dealerButton].userId, gameId, 'SMALLBLIND');
        if(dealerButton == playerCount - 1){
          dealerButton = 0;
        }else{
          dealerButton++;
        }
      }
      //SET BIG BLIND
      console.log('SET BIGBLIND ' + dealerButton);
      await Games.setPlayerBlindStatus(players[dealerButton].userId, gameId, 'BIGBLIND');
      
    })
    .then(() => {
      return Promise.resolve(gameId);
    })
    .catch(err => console.log(err));

}

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = newRound;