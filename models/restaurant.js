"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      restaurant.belongsTo(models.user);
      restaurant.belongsToMany(models.tag, {
        through: "restaurantTags",
        foreignKey: "restaurantId",
      });
    }
  }
  restaurant.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      location: DataTypes.STRING,
      rating: DataTypes.INTEGER,
      dateVisited: DataTypes.DATEONLY,
      priceCategory: DataTypes.INTEGER,
      image1: DataTypes.STRING,
      image2: DataTypes.STRING,
      image3: DataTypes.STRING,
      additionalInfo: DataTypes.TEXT,
      isReviewed: { type: DataTypes.BOOLEAN, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "restaurant",
    }
  );
  return restaurant;
};
