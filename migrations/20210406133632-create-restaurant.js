"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("restaurants", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING,
      },
      rating: {
        type: Sequelize.INTEGER,
      },
      dateVisited: {
        type: Sequelize.DATEONLY,
      },
      priceCategory: {
        type: Sequelize.INTEGER,
      },
      image1: {
        type: Sequelize.STRING,
      },
      image2: {
        type: Sequelize.STRING,
      },
      image3: {
        type: Sequelize.STRING,
      },
      additionalInfo: {
        type: Sequelize.TEXT,
      },
      isReviewed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("restaurants");
  },
};
