const Games = require('../Games');
const Lobby = require('../Lobby');

const nextTurn = (gameId, isTurn) => {
  console.log("current Turn: " + isTurn);
  return Games.checkActivePlayer(gameId)
  .then((result) => {
    console.log(result.count);
    if(result.count == isTurn + 1){
      console.log("next Turn: 0");
      return Games.setPlayerTurn(0, gameId);
    }else{
      isTurn++;
      console.log("next Turn: " + isTurn);
      return Games.setPlayerTurn(isTurn, gameId);
    }
  })
}


module.exports = nextTurn;