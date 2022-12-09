'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * CREATE TABLE IF NOT EXISTS `poker`.`messages` (
  `messagesID` INT NOT NULL AUTO_INCREMENT,
  `message` VARCHAR(255) NULL DEFAULT NULL,
  `gameUserID` INT NULL DEFAULT NULL,
  PRIMARY KEY (`messagesID`),
  UNIQUE INDEX `idmessages_UNIQUE` (`messagesID` ASC) VISIBLE,
  INDEX `fk_messages_game_user1_idx` (`gameUserID` ASC) VISIBLE,
  CONSTRAINT `fk_messages_game_user1`
    FOREIGN KEY (`gameUserID`)
    REFERENCES `poker`.`game_user` (`gameUserID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
     */
    return queryInterface.createTable('messages', {
      messageId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      message:{
        type: Sequelize.STRING,
        defaultValue: null,
        allowNull: true,
      },

      
    }).then(() => queryInterface.addIndex('messages', ['messageId', 'gameUserId']))

  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('messages');
  }
};
