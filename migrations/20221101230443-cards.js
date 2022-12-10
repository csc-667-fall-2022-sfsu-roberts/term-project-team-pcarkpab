'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Create the cards table
    await queryInterface.createTable('cards',{
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
      suit:{
        type: Sequelize.ENUM,
        values: ['HEARTS', 'CLUBS', 'DIAMONDS', 'SPADES'],
        allowNull: true,
        defaultValue: null,
      }
    });
   
    
    // Insert the cards into the cards table
    for (let suit of ['HEARTS', 'CLUBS', 'DIAMONDS', 'SPADES']) {
      for (let rank = 1; rank <= 13; rank++) {
        await queryInterface.bulkInsert('cards', [{ rank, suit }]);
      }
    }

    //default card face down
    await queryInterface.bulkInsert('cards', [{rank: 0, suit: 'SPADES'}]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('cards');
  }
};
