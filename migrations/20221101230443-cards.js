'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
    return queryInterface.createTable('cards',{
 
      cardId:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },

      rank:{
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true,
      },

      cardName:{
        type: Sequelize.STRING(32),
        defaultValue: null,
        allowNull: true,
      },

      suit:{
        type: Sequelize.ENUM,
        values: ['HEARTS', 'CLUBS', 'DIAMONDS', 'SPADES'],
        allowNull: true,
        defaultValue: null,
      }


    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('cards');
  }
};
