const Games = require('../Games');
const getData = require('./getData');
const Users = require('../Users');
const calculatePokerHandScore = require('../../handler/hands');

const getWinner = async (gameId) => {
  const gameData = await getData(gameId);
  let winnerId = -1;
  let remainingPlayer = 0;
  let cardsAndUserIds = [];
  let userIdsAndScores = [];

  if (gameData.playerInfo.length > 0) {
    for (const player of gameData.playerInfo) {
      if (player.playerStatus != 'FOLD') {
        remainingPlayer++;
        winnerId = player.userId;
        if (gameData.gamePhase == 'FINALREVEAL') {
          let cards = gameData.dealerCards.concat(player.cards);
          cardsAndUserIds.push({ cards, userId: player.userId });
        }
      }
    }
  }


  //Win by being the only one left
  if (remainingPlayer == 1) {
    return winnerId;
  }
  if (gameData.gamePhase == 'FINALREVEAL') {
    for (const cardAndUserId of cardsAndUserIds) {
      let cards = [];
      for (const id of cardAndUserId.cards) {
        let result = await Games.getRankAndSuit(id);
        cards.push({ rank: result.rank, suit: result.suit });
      }
      console.log(cards);
      console.log(calculatePokerHandScore(cards));
      let username = await Users.getUsername(cardAndUserId.userId);
      userIdsAndScores.push({ userId: cardAndUserId.userId, username, score: calculatePokerHandScore(cards) });
    }

    userIdsAndScores.sort((a, b) => {
      return b.score - a.score;
    });

    console.log(userIdsAndScores);
    return userIdsAndScores[0].userId;
  }

  return userIdsAndScores;
}

module.exports = getWinner;