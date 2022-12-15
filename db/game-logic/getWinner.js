const Games = require('../Games');
const getData = require('./getData');

const getWinner = async (gameId) => { 
  const gameData = await getData(gameId);
  let winnerId = -1;
  let remainingPlayer = 0;
  let idAndScore = [];
  for(const player of gameData.playerInfo){
    if(player.gameStatus != 'FOLD'){
      remainingPlayer++;
      winnerId = player.userId;
    }
  }
  //Win by being the only one left
  if(remainingPlayer == 1){
    return winnerId;
  }
  
    
}

module.exports = getWinner;