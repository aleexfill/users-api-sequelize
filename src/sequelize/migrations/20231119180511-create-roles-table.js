'use strict';

const { v4: uuid } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Roles', {
      roleId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      role: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.bulkInsert('Roles', [
      {
        roleId: uuid(),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleId: uuid(),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Roles');
  },
};
