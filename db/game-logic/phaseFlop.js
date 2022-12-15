const Games = require('../Games');
const nextTurn = require('./nextTurn');

const phaseFlop = async (gameId) => {
  await Games.setGamePhase(gameId, 'FLOP');

  const players = await Games.getActivePlayersData(gameId);
  let dealerButton = -1;
  for(const player of players){
    if(player.blindStatus == 'DEALER'){
      dealerButton = player.seatNumber;
    }
  }
  //Set the dealer (bot) status to check to allow check
  await Games.setPlayerStatus(0, gameId, 'CHECK');
  await Games.setPlayerTurn(dealerButton, gameId);
  await nextTurn(gameId, dealerButton);
}

module.exports = phaseFlop;