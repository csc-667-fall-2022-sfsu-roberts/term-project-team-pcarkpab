const Games = require('../Games');


const assignCards = (gameId) => {
  let cards;
  let dealerId = 0;
  return Games.getDeck(gameId)
    .then((results) => {
      return Promise.all(results.map((card) => {
        return card.cardId;
      }));
    })
    .then((results) => {
      cards = results;
      return Games.getActivePlayersData(gameId);
    })
    .then((results) => {
      return Promise.all(results.map((player) => {
        //Assign to each player 2 cards
        Games.assignPlayerCard(player.userId, gameId, cards.pop());
        Games.assignPlayerCard(player.userId, gameId, cards.pop());
        return Promise.resolve();
      }))
    })
    .then((result) => {
      return Games.assignPlayerCard(dealerId, gameId, cards.pop());
    })
    .then((result) => {
      return Games.assignPlayerCard(dealerId, gameId, cards.pop());
    })
    .then((result) => {
      return Games.assignPlayerCard(dealerId, gameId, cards.pop());
    })
    .then((result) => {
      return Games.assignPlayerCard(dealerId, gameId, cards.pop());
    })
    .then((result) => {
      return Games.assignPlayerCard(dealerId, gameId, cards.pop());
    })

}

module.exports = assignCards;