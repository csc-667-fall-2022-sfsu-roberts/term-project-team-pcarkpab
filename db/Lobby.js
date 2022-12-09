const db = require('./database');

const create = (username, minimumBet, gamePassword) => {
  let baseSQL =
    "INSERT INTO game (owner, pot, \"minimumBet\", \"gamePassword\", \"gamePhase\", \"gameStatus\", \"playerCount\") VALUES (${username}, 0, ${minimumBet}, ${gamePassword}, 'PREGAME', 'WAITINGROOM', 1) RETURNING \"gameId\"";
    return db.query(baseSQL, {username, minimumBet, gamePassword});
}

const list = () => {
  let baseSQL = 
    "SELECT * FROM game";
    return db.query(baseSQL);
}

module.exports = {create, list};