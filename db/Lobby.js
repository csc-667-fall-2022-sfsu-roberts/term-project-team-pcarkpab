const db = require('./database');

const create = (minimumBet, gamePassword) => {
  let baseSQL =
    "INSERT INTO game (pot, \"minimumBet\", \"gamePassword\", \"gamePhase\", \"gameStatus\") VALUES (0, ${minimumBet}, ${gamePassword}, 'PREGAME', 'WAITINGROOM') RETURNING \"gameId\"";
    return db.query(baseSQL, {minimumBet, gamePassword});
}

module.exports = {create};