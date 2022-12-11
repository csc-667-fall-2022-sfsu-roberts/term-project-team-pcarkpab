const db = require('./database');

const setGameStatus = (gameId, gameStatus) => {
  let baseSQL =
    "UPDATE game SET \"gameStatus\" = ${gameStatus} WHERE \"gameId\"=${gameId}";
  return db.query(baseSQL, {gameStatus, gameId});
}

const initializeGameDeck = (gameId) => {
  let baseSQL1 =
    "SELECT \"cardId\" FROM cards";
  let baseSQL2 =
    "INSERT INTO game_cards (\"gameId\", \"gameUserId\", \"cardId\") VALUES";
  return db.query(baseSQL1)
  .then((result) => {
    let values = result.map(row => `(${gameId}, 0, ${row.cardId})`).join(", ");
    let sql = `${baseSQL2} ${values}`;
    return db.none(sql);
  });
}

const shuffleDeck = (gameId) => {
  let baseSQL1 =
    "SELECT \"gameUserId\", \"cardId\" FROM game_cards WHERE \"gameId\"=${gameId} AND in_deck=true";
  let baseSQL2 =
    "INSERT INTO game_cards ( \"gameUserId\", \"cardId\", \"gameId\") VALUES";
  let baseSQL3 =
    "DELETE FROM game_cards WHERE \"gameId\"=${gameId}";
  return db.query(baseSQL1, {gameId})
  .then((result) => {
    let values = result
      .map(row => `( ${row.gameUserId}, ${row.cardId}, ${gameId})`)
      .sort(() => Math.random() - 0.5)
      .join(", ");
    let sql1 = `${baseSQL2} ${values}`;
    return db.none(baseSQL3, {gameId})
    .then(() => db.none(sql1));
  });
}

module.exports = {
  setGameStatus,
  initializeGameDeck,
  shuffleDeck,
};