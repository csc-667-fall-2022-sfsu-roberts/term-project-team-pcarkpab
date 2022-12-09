'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * CREATE TABLE IF NOT EXISTS `poker`.`game_cards` (
  `gameCardsID` INT NOT NULL AUTO_INCREMENT,
  `gameID` INT NULL DEFAULT NULL,
  `cardsID` INT NOT NULL,
  `gameUserID` INT NULL,
  `is_discarded` TINYINT NULL DEFAULT '0',
  `in_deck` TINYINT NULL DEFAULT '0',
  `on_table` TINYINT NULL DEFAULT '0',
  PRIMARY KEY (`gameCardsID`),
  INDEX `fk_game_cards_game1_idx` (`gameID` ASC) VISIBLE,
  INDEX `fk_game_cards_cards1_idx` (`cardsID` ASC) VISIBLE,
  INDEX `fk_game_cards_game_user1_idx` (`gameUserID` ASC) VISIBLE,
  CONSTRAINT `fk_game_cards_cards1`
    FOREIGN KEY (`cardsID`)
    REFERENCES `poker`.`cards` (`cardsID`),
  CONSTRAINT `fk_game_cards_game1`
    FOREIGN KEY (`gameID`)
    REFERENCES `poker`.`game` (`gameID`),
  CONSTRAINT `fk_game_cards_game_user1`
    FOREIGN KEY (`gameUserID`)
    REFERENCES `poker`.`game_user` (`gameUserID`))
     */
    return queryInterface.createTable('game_cards', {
      gameCardId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
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

      gameUserId:{
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: 'game_user',
            schema: 'public'
          },
          key: 'gameUserId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      cardId:{
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: 'cards',
            schema: 'public'
          },
          key: 'cardId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      
      
      isDiscarded:{
        type: Sequelize.INTEGER,
        allowNull: true,
        default: 0,
      },

      in_deck:{
        type: Sequelize.INTEGER,
        allowNull: true,
        default: 0,
      },

      on_table:{
        type: Sequelize.INTEGER,
        allowNull: true,
        default: 0,
      }
    })

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     return queryInterface.dropTable('game_cards');
  }
};
