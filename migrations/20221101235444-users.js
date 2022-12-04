'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable('users', {
      userId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      username:{
        type: Sequelize.STRING(45),
        defaultValue: null,
        allowNull: true,
      },
      globalMoney:{
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true,
      },
      password:{
        type: Sequelize.STRING(30),
        defaultValue: null,
        allowNull: true,
      },
      email:{
        type: Sequelize.STRING(63),
        defaultValue: null,
        allowNull: true,
      },
    }).then(() => queryInterface.addIndex('users', ['userId']))

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     return queryInterface.dropTable('users');
  }
};
