const db = require('./database');

const create = (username, minimumBet, gamePassword) => {
  let baseSQL =
    "INSERT INTO game (owner, pot, \"minimumBet\", \"gamePassword\", \"gamePhase\", \"gameStatus\") VALUES (${username}, 0, ${minimumBet}, ${gamePassword}, 'PREGAME', 'WAITINGROOM') RETURNING \"gameId\"";
  return db.one(baseSQL, { username, minimumBet, gamePassword });
}

const deleteLobby = (gameId) => {
  let baseSQL1 =
  "DELETE FROM game WHERE \"gameId\"=${gameId};"
  let baseSQL2 =
  "DELETE FROM game_user WHERE \"gameId\"=${gameId};";
  let baseSQL3 =
  "DELETE FROM game_cards WHERE \"gameId\"=${gameId};";
  return db.none(baseSQL1, {gameId})
  .then(() => {
    db.none(baseSQL2, {gameId});
  })
  .then(() => {
    db.none(baseSQL3, {gameId});
  });
}

const list = () => {
  let baseSQL =
    "SELECT * FROM game";
  return db.query(baseSQL);
}

const checkPlayerCount = (gameId) => {
  let baseSQL =
    "SELECT COUNT(*) AS count FROM game_user WHERE \"gameId\"=${gameId}";
  return db.one(baseSQL, {gameId});
}

const checkAlreadyInLobby = (userId, gameId) => {
  let baseSQL =
    "SELECT * FROM game_user WHERE \"gameId\"=${gameId} AND \"userId\"=${userId}";
  return db.one(baseSQL, {gameId, userId});
}

const addPlayer = (userId, gameId) => {
  
  let baseSQL =
  "INSERT INTO game_user (\"userId\", \"gameId\", \"chipsHeld\") VALUES (${userId}, ${gameId}, 500) RETURNING \"gameId\", \"gameUserId\"";
  return db.one(baseSQL, {userId, gameId});
}

const removePlayer = (userId, gameId) => {
  let baseSQL =
  "DELETE FROM game_user WHERE \"userId\"=${userId} AND \"gameId\"=${gameId} RETURNING \"gameId\";"
  return db.one(baseSQL, {userId, gameId});
}

module.exports = { create, deleteLobby, list, checkPlayerCount, checkAlreadyInLobby, addPlayer, removePlayer };