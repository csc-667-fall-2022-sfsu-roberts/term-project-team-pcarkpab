const Games = require('../Games');
const Lobby = require('../Lobby');

const nextTurn = (gameId, isTurn) => {
  return Games.checkActivePlayer(gameId)
  .then((result) => {
    if(result.count == isTurn + 1){
      return Games.setPlayerTurn(0, gameId);
    }else{
      isTurn++;
      return Games.setPlayerTurn(isTurn, gameId);
    }
  })
}


module.exports = nextTurn;