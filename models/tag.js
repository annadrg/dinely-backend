"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      tag.belongsTo(models.user);
      tag.belongsToMany(models.restaurant, {
        through: "restaurantTags",
        foreignKey: "tagId",
      });
    }
  }
  tag.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      color: { type: DataTypes.STRING, defaultValue: "#000000" },
      userId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "tag",
    }
  );
  return tag;
};
