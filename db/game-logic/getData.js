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

const getData = (userId, gameId) => {
  const data = {};
  data.userId = userId;

  return Game.getAllPlayersData(gameId)
    .then((players) => {
      data.playerCount = players.length;
      let cardsArr;
      let playerInfo = players.map((player) => {
        return Game.getPlayerCards(userId, gameId)
          .then((cards) => {
            cardsArr = cards.map((card) => {
              return cards.cardId;
            })
          })
          .then(() =>{
            return Users.getUsername(player.userId);
          })
          .then((result) => {
            return {
              userId: player.userId,
              username: result.username,
              money: player.chipsHeld,
              betAmount: player.chipsBet,
              cards: cardsArr,
              isTurn: player.isTurn,
              playerStatus: player.status,
              blindStatus: player.blindStatus,
              seatNumber: player.seatNumber,
            };
          })
          .catch(err => console.log(err));
      });
      return Promise.all(playerInfo);
    })
    .then((playerInfo) => {
      data.playerInfo = playerInfo;
    })
    .then(() => {
      console.log(data);
      return Game.getGame(gameId)
        .then((result) => {
          data.gamePhase = result.gamePhase;
          data.pot = result.pot;
        })
    })
    .then(() => {
      return Game.getPlayerData(0, gameId)
      .then((result) => {
        data.currentBet = result.chipsBet;
      })
    })
    .then(() => {
      return Game.getPlayerCards(0, gameId)
      .then((result) => {
        data.dealerCard = result.map((card) => card.cardId);
      })
    })
    .then(() => {
      return Promise.resolve(data);
    })
    .catch(err => console.log(err));
}

module.exports = getData;