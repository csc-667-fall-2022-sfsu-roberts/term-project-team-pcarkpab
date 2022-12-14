'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.createTable('game', {
      gameId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },

      owner: {
        type: Sequelize.STRING(30),
        defaultValue: null,
        allowNull: true,
      },

      pot: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true,
      },

      minimumBet: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true,
      },

      gamePhase: {
        type: Sequelize.ENUM,
        values: ['PREGAME', 'ANTE', 'ASSIGNCARDS', 'PREFLOP', 'FLOP', 'TURN', 'RIVER', 'FINALREVEAL', 'GAMEEND'],
        defaultValue: null,
        allowNull: true,
      },

      gameStatus: {
        type: Sequelize.ENUM,
        values: ['WAITINGROOM', 'INGAME', 'FINISHEDGAME', 'SESSSIONEND'],
        defaultValue: null,
        allowNull: true,
      },

    }).then(() => queryInterface.addIndex('game', ['gameId']))

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable('game')
      .then(() => {
        return queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_game_gamePhase";');
      })
      .then(() => {
        return queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_game_gameStatus";');
      });
  }
};
