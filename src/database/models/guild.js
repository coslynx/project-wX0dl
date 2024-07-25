const { Sequelize, DataTypes } = require('sequelize');
const { databaseConfig } = require('../../config/database');

module.exports = (sequelize, DataTypes) => {
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
  }, {
    freezeTableName: true,
  });

  Guild.associate = (models) => {
    // Add any associations if necessary
    // Guild.hasMany(models.Playlist, {
    //   foreignKey: 'guildId',
    //   onDelete: 'CASCADE',
    // });
  };

  return Guild;
};