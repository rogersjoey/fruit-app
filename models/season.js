"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Season extends Model {
    static associate(models) {
      Season.belongsToMany(models.Fruit, {
        through: "SeasonFruit",
        foreignKey: "seasonId",
        otherKey: "fruitId",
      });
    }
  }
  Season.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Season",
    }
  );
  return Season;
};