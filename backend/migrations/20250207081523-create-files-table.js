'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('files', {
      file_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      file_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      firebase_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mime_type: {
        type: Sequelize.STRING,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',  // This must match the actual table name in the database
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('files');
  }
};
