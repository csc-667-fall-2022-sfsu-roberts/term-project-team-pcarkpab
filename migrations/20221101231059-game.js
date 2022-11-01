'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable('game', {
      gameID:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      pot:{
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true,
      },

      minimumBet:{
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true,
      }, 

      gamePassword:{
        type: Sequelize.STRING(30),
        defaultValue: null,
        allowNull: true,
      },

      gamePhase:{
        type: Sequelize.ENUM,
        values: ['PREGAME', 'ANTE', 'ASSIGNCARDS', 'PREFLOP', 'FLOP', 'TURN', 'RIVER', 'FINALREVEAL', 'GAMEEND'],
        defaultValue: null,
        allowNull: true,
      },

      gameStatus:{
        type: Sequelize.ENUM,
        values: ['WAITINGROOM', 'INGAME', 'FINISHEDGAME', 'SESSSIONEND'],
        defaultValue: null,
        allowNull: true,
      },
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable('game');
  }
};
