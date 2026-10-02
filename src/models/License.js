const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const License = sequelize.define(
  "License",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    key: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    hwidHash: {
      type: DataTypes.STRING(64),
      allowNull: true,
      field: "hwid_hash",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active",
    },
    isActivated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_activated",
    },
    activatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "activated_at",
    },
    notes: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "licenses",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = License;
