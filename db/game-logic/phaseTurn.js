const Games = require('../Games');
const nextTurn = require('./nextTurn');

const phaseTurn = async (gameId) => {
  await Games.setGamePhase(gameId, 'TURN');

  const players = await Games.getActivePlayersData(gameId);
  let dealerButton = -1;
  for(const player of players){
    if(player.blindStatus == 'DEALER'){
      dealerButton = player.seatNumber;
    }
    //Reset their status to bet 
    if(player.status == 'CHECK'){
      await Games.setPlayerStatus(player.userId, gameId, 'BET');
    }
  }
  //Set the dealer (bot) status to check to allow check
  await Games.setPlayerStatus(0, gameId, 'CHECK');
  await Games.setPlayerTurn(dealerButton, gameId);
  await nextTurn(gameId, dealerButton);
}

module.exports = phaseTurn;