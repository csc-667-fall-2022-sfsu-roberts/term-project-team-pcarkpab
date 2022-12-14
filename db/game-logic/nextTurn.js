const Games = require('../Games');


const nextTurn = async (gameId, isTurn) => {
  console.log("current Turn: " + isTurn);

  // Check the active player
  const result = await Games.checkActivePlayer(gameId);
  // Loop until we find the next active player
  while (true) {
    // If the current turn is the last player, set the turn to the first player (with seat number 0)
    if (result.count == (isTurn + 1)) {
      console.log("next Turn: 0");
      await Games.setPlayerTurn(0, gameId);
    } else {
      // Otherwise, set the turn to the next player
      isTurn++;
      console.log("next Turn: " + isTurn);
      await Games.setPlayerTurn(isTurn, gameId);
    }

    // Check the status of the player with the current seat number
    const playerStatus = await Games.checkPlayerStatusWithSeatNum(gameId, isTurn);

    // If the player is not in the "FOLD" state, we have found the next active player
    if (playerStatus.status !== 'FOLD') {
      break;
    }
  }
}


module.exports = nextTurn;