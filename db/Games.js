const db = require('./database');

const setGameStatus = (gameId, gameStatus) => {
  let baseSQL =
    "UPDATE game SET \"gameStatus\" = ${gameStatus} WHERE \"gameId\"=${gameId}";
  return db.query(baseSQL, { gameStatus, gameId });
}


const setGamePhase = (gameId, gamePhase) => {
  let baseSQL =
    "UPDATE game SET \"gamePhase\" = ${gamePhase} WHERE \"gameId\"=${gameId}";
  return db.query(baseSQL, { gamePhase, gameId });
}



const initializeGameDeck = (gameId) => {
  let baseSQL1 =
    "SELECT \"cardId\" FROM cards";
  let baseSQL2 =
    "INSERT INTO game_cards (\"gameId\", \"userId\", \"cardId\") VALUES";
  return db.query(baseSQL1)
    .then((result) => {
      let values = result.map(row => `(${gameId}, 0, ${row.cardId})`).join(", ");
      let sql = `${baseSQL2} ${values}`;
      return db.none(sql);
    })
    .catch(err => Promise.reject(err));
}

const shuffleDeck = (gameId) => {
  let baseSQL1 =
    "SELECT \"userId\", \"cardId\" FROM game_cards WHERE \"gameId\"=${gameId} AND in_deck=true";
  let baseSQL2 =
    "INSERT INTO game_cards ( \"userId\", \"cardId\", \"gameId\") VALUES";
  let baseSQL3 =
    "DELETE FROM game_cards WHERE \"gameId\"=${gameId}";
  return db.query(baseSQL1, { gameId })
    .then((result) => {
      let values = result
        .map(row => `( ${row.userId}, ${row.cardId}, ${gameId})`)
        .sort(() => Math.random() - 0.5)
        .join(", ");
      let sql1 = `${baseSQL2} ${values}`;
      return db.none(baseSQL3, { gameId })
        .then(() => {
          return db.none(sql1)
        });
    });
}

const getPlayerData = (userId, gameId) => {
  let baseSQL =
    "SELECT * FROM game_user WHERE \"gameId\"=${gameId} AND \"userId\"=${userId}";
  return db.one(baseSQL, { userId, gameId });
}

const getAllPlayersData = (gameId) => {
  let baseSQL =
    "SELECT * FROM game_user WHERE \"gameId\"=${gameId} AND \"userId\">0";
  return db.query(baseSQL, { gameId });
}

const getPlayerCards = (userId, gameId) => {
  let baseSQL =
    "SELECT \"cardId\" FROM game_cards WHERE \"gameId\"=${gameId} AND \"userId\"=${userId} AND in_deck=false";
  return db.query(baseSQL, { userId, gameId });
}

const setPlayerDefault = (userId, gameId) => {
  let baseSQL =
    "UPDATE game_user SET \"chipsBet\"=0,\"blindStatus\"='NONE', status='IDLE' WHERE \"gameId\"=${gameId} AND \"userId\"=${userId}";
  return db.query(baseSQL, { userId, gameId });
}

const setPlayerBlindStatus = (userId, gameId, blindStatus) => {
  let baseSQL =
    "UPDATE game_user SET \"blindStatus\" = ${blindStatus} WHERE \"gameId\"=${gameId} AND \"userId\"=${userId}";
  return db.query(baseSQL, { userId, gameId, blindStatus });
}

const assignPlayerSeat = (userId, gameId, seatNumber) => {
  let baseSQL =
    "UPDATE game_user SET \"seatNumber\" = ${seatNumber} WHERE \"gameId\"=${gameId} AND \"userId\"=${userId}";
  return db.query(baseSQL, { userId, gameId, seatNumber });
}

const getGame = (gameId) => {
  let baseSQL =
    "SELECT * FROM game WHERE \"gameId\"=${gameId}";
  return db.one(baseSQL, { gameId });
}

const setPlayerBet = (userId, gameId, betAmount) => {
  let baseSQL =
  "UPDATE game_user SET \"chipsBet\" = ${betAmount} WHERE \"gameId\"=${gameId} AND \"userId\"=${userId}";
  return db.query(baseSQL, {userId, gameId, betAmount});
}

const setPlayerTurn = (seatNumber, gameId) => {
  let baseSQL =
  "UPDATE game SET \"isTurn\" = ${seatNumber} WHERE \"gameId\"=${gameId}";
  return db.query(baseSQL, {seatNumber, gameId});
}

const setPlayerStatus = (userId, gameId, status) => {
  let baseSQL =
    "UPDATE game_user SET \"status\" = ${status} WHERE \"gameId\"=${gameId} AND \"userId\"=${userId}";
  return db.query(baseSQL, { userId, gameId, status });
}

const addPlayerMoney = (userId, gameId, money) => {
  let baseSQL =
  "UPDATE game_user SET \"chipsHeld\" = \"chipsHeld\" + ${money} WHERE \"gameId\"=${gameId} AND \"userId\"=${userId}";
  return db.query(baseSQL, { userId, gameId, money });
}

const deducePlayerMoney = (userId, gameId, money) => {
  let baseSQL =
  "UPDATE game_user SET \"chipsHeld\" = \"chipsHeld\" - ${money} WHERE \"gameId\"=${gameId} AND \"userId\"=${userId}";
  return db.query(baseSQL, { userId, gameId, money });
}

module.exports = {
  setGameStatus,
  setGamePhase,
  initializeGameDeck,
  shuffleDeck,
  getPlayerData,
  getAllPlayersData,
  getPlayerCards,
  setPlayerDefault,
  setPlayerBlindStatus,
  assignPlayerSeat,
  getGame,
  setPlayerBet,
  setPlayerTurn,
  setPlayerStatus,
  addPlayerMoney,
  deducePlayerMoney,
};