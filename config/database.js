const { Sequelize, DataTypes } = require('sequelize');
const { databaseConfig } = require('../config/database');

// Create a new Sequelize instance
const sequelize = new Sequelize(
  databaseConfig.database,
  databaseConfig.username,
  databaseConfig.password,
  {
    host: databaseConfig.host,
    dialect: databaseConfig.dialect,
    logging: false, // Disable logging for production
  }
);

// Define models
const Guild = sequelize.define('Guild', {
  guildId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  prefix: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '!',
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'en',
  },
  playlists: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
});

// Define associations
// ... (Add any associations if necessary)

module.exports = {
  sequelize,
  Guild,
  // ... (Add other models if necessary)
};