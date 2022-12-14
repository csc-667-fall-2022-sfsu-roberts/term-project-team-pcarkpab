'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.createTable('game_user', {
      gameUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,

      },

      gameId: {
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

      chipsHeld: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },

      chipsBet: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },

      isTurn: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },

      blindStatus: {
        type: Sequelize.ENUM,
        values: ['NONE', 'BIGBLIND', 'SMALLBLIND', 'DEALER'],
        defaultValue: 'NONE',
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM,
        values: ['SPECTATOR', 'IDLE', 'RAISE', 'CALL', 'CHECK', 'FOLD'],
        defaultValue: 'SPECTATOR',
        allowNull: true,
      },

      seatNumber: {
        type: Sequelize.INTEGER,
        allowNull: true,
      }

    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('game_user')
      .then(() => {
        return queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_game_user_status";');
      })
      .then(() => {
        return queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_game_user_blindStatus";');
      })
  }
};
