const Games = require('../Games');


const assignCards = async (gameId) => {
  let cards;
  let dealerId = 0;

  // Get the deck of cards
  const results = await Games.getDeck(gameId);

  // Extract the card IDs from the results
  cards = await Promise.all(results.map((card) => card.cardId));

  // Get the active players' data
  const players = await Games.getActivePlayersData(gameId);

  // Loop over the players and assign them two cards each
  for (const player of players) {
    await Games.assignPlayerCard(player.userId, gameId, cards.pop());
    await Games.assignPlayerCard(player.userId, gameId, cards.pop());
  }

  // Assign cards to the dealer
  await Games.assignPlayerCard(dealerId, gameId, cards.pop());
  await Games.assignPlayerCard(dealerId, gameId, cards.pop());
  await Games.assignPlayerCard(dealerId, gameId, cards.pop());
  await Games.assignPlayerCard(dealerId, gameId, cards.pop());
  await Games.assignPlayerCard(dealerId, gameId, cards.pop());
}


module.exports = assignCards;