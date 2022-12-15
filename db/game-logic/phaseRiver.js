const Games = require('../Games');
const nextTurn = require('./nextTurn');

const phaseRiver = async (gameId) => {
  await Games.setGamePhase(gameId, 'RIVER');

  const players = await Games.getActivePlayersData(gameId);
  let dealerButton = -1;
  for(const player of players){
    if(player.blindStatus == 'DEALER'){
      dealerButton = player.seatNumber;
    }
    //Reset their status to bet or check status
    if(player.status == 'CHECK' || player.status == 'BET'){
      await Games.setPlayerStatus(player.userId, gameId, 'IDLE');
    }
  }
  //Set the dealer (bot) status to check to allow check
  await Games.setPlayerStatus(0, gameId, 'CHECK');
  await Games.setPlayerTurn(dealerButton, gameId);
  await nextTurn(gameId, dealerButton);
}

module.exports = phaseRiver;