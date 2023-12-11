'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Roles', 'role', {
      type: Sequelize.ENUM('admin', 'user'),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Roles', 'role', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
