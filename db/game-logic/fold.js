const Games = require('../Games');

const fold = (userId, gameId) => {

  return Games.setPlayerStatus(userId, gameId, 'FOLD');
    
}

module.exports = fold;