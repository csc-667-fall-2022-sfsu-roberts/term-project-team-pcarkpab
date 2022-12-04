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
  PRIMARY KEY (`gameUserID`),
  UNIQUE INDEX `idgame_user_UNIQUE` (`gameUserID` ASC) VISIBLE,
  INDEX `fk_game_user_game_idx` (`gameID` ASC) VISIBLE,
  INDEX `fk_game_user_user1_idx` (`userID` ASC) VISIBLE,
  CONSTRAINT `fk_game_user_game`
    FOREIGN KEY (`gameID`)
    REFERENCES `poker`.`game` (`gameID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_game_user_user1`
    FOREIGN KEY (`userID`)
    REFERENCES `poker`.`user` (`userID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
     */
    return queryInterface.createTable('game_user', {
      gameUserId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },

      userId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
            schema: 'public'
          },
          key: 'userId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      gameId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'game',
            schema: 'public'
          },
          key: 'gameId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

      blindStatus:{
        type: Sequelize.ENUM,
        values: ['NONE', 'BIGBLIND', 'SMALLBLIND'],
        default: null,
        allowNull: true,
      },

      status:{
        type: Sequelize.ENUM,
        values: ['INGAME', 'SPECTATOR', 'IDLE', 'LEFTGAME', 'LOSER', 'WINNER'],
        default: null,
        allowNull: true,
      },

      seatNumber:{
        type: Sequelize.INTEGER,
        allowNull: true,
      }

    }).then(() => queryInterface.addIndex('game_user', ['gameId', 'userId', 'gameUserId']))
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('game_user');
  }
};
