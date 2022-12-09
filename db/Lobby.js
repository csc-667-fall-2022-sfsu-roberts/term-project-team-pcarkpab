const db = require('./database');

const create = (username, minimumBet, gamePassword) => {
  let baseSQL =
    "INSERT INTO game (owner, pot, \"minimumBet\", \"gamePassword\", \"gamePhase\", \"gameStatus\") VALUES (${username}, 0, ${minimumBet}, ${gamePassword}, 'PREGAME', 'WAITINGROOM') RETURNING \"gameId\"";
  return db.query(baseSQL, { username, minimumBet, gamePassword });
}

const list = () => {
  let baseSQL =
    "SELECT * FROM game";
  return db.query(baseSQL);
}

const checkPlayerCount = (gameId) => {
  let baseSQL =
    "SELECT COUNT(*) AS count FROM game_user WHERE \"gameId\"=${gameId}";
  return db.query(baseSQL, {gameId});
}

module.exports = { create, list, checkPlayerCount };