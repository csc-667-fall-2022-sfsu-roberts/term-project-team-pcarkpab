'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * `gameUserID` INT NOT NULL AUTO_INCREMENT,
  `gameID` INT NOT NULL,
  `userID` INT NOT NULL,
  `chipsHeld` INT NULL DEFAULT NULL,
  `chipsBet` INT NULL DEFAULT NULL,
  `status` ENUM('INGAME', 'SPECTATOR', 'IDLE', 'LEFTGAME', 'LOSER', 'WINNER') NULL DEFAULT NULL,
  `isFold` TINYINT NULL,
     */
    return queryInterface.createTable('game-user', {
      gameUserId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },

      userId:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      gameId:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      
      chipsHeld:{
        type: Sequelize.INTEGER,
        allowNull: true,
        default: null,
      },

      chipsBet:{
        type: Sequelize.INTEGER,
        allowNull: true,
        default: null,
      },

      isFold:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('game-user');
  }
};
