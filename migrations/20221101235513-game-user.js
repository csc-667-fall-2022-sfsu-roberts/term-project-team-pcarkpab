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
        default: null,
      },

      chipsBet: {
        type: Sequelize.INTEGER,
        allowNull: true,
        default: null,
      },

      isFold: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        default: false,
      },

      blindStatus: {
        type: Sequelize.ENUM,
        values: ['NONE', 'BIGBLIND', 'SMALLBLIND', 'DEALER'],
        default: null,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM,
        values: ['SPECTATOR', 'IDLE', 'RAISE', 'CALL', 'CHECK', 'FOLD'],
        default: null,
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
