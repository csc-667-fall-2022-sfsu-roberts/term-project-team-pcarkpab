const Game = require('../Games');
const Users = require("../Users");
/*
const gameData = {
  pot: 0,
  playerCount: 4,
  playerInfo: [
    { userId: 1, username: 'John', money: 500, cards: [12, 13], betAmount: 0, isTurn: false, playerStatus: 'idle', blindStatus: 'dealer', seatNumber: 0 },
    { userId: 2, username: 'Deja', money: 500, cards: [35, 27], betAmount: 0, isTurn: false, playerStatus: 'idle', blindStatus: 'small-blind', seatNumber: 1 },
    { userId: 3, username: 'Mary', money: 500, cards: [45, 21], betAmount: 0, isTurn: false, playerStatus: 'idle', blindStatus: 'big-blind', seatNumber: 2 },
    { userId: 4, username: 'Peter', money: 500, cards: [46, 6], betAmount: 0, isTurn: false, playerStatus: 'idle', blindStatus: 'none', seatNumber: 3 },
  ],
  dealerCards: [3, 50, 42],
  currentBet: 0,
  gamePhase: 'ANTE',
  userId: 1,
}

*/

const getData = (gameId) => {
  const data = {};

  return Game.getActivePlayersData(gameId)
    .then(async (players) => {
      data.playerCount = players.length;
      let cardsArr;
      const playerInfo = [];

      // Use a for loop to process each player's information
      for (const player of players) {
        try {
          // Get the player's cards
          const cards = await Game.getPlayerCards(player.userId, gameId);
          // Resolve each card's ID
          cardsArr = await Promise.all(cards.map(card => Promise.resolve(card.cardId)));
          // Get the player's username
          const result = await Users.getUsername(player.userId);

          playerInfo.push({
            userId: player.userId,
            username: result.username,
            money: player.chipsHeld,
            betAmount: player.chipsBet,
            cards: cardsArr,
            playerStatus: player.status,
            blindStatus: player.blindStatus,
            seatNumber: player.seatNumber,
          });
        } catch (err) {
          console.log(err);
        }
      }

      data.playerInfo = playerInfo;
      return Promise.resolve();
    })

    .then(() => {
      return Game.getGame(gameId)
        .then((result) => {
          data.gamePhase = result.gamePhase;
          data.pot = result.pot;
          data.isTurn = result.isTurn;
          data.minimumBet = result.minimumBet;
          return Promise.resolve();
        })
    })
    .then(() => {
      return Game.getPlayerData(0, gameId)
        .then((result) => {
          data.currentBet = result.chipsBet;
          return Promise.resolve();
        })
    })
    .then(() => {
      return Game.getPlayerCards(0, gameId)
        .then((result) => {
          return Promise.all(result.map((card) => {
            return Promise.resolve(card.cardId)
          }));
        })
    })
    .then((cards) => {
      data.dealerCards = cards;
      return Promise.resolve();
    })
    .then(() => {
      return Promise.resolve(data);
    })
    .catch(err => console.log(err));
}

module.exports = getData;