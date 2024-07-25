const { Sequelize, DataTypes } = require('sequelize');
const { databaseConfig } = require('../../config/database');

module.exports = (sequelize, DataTypes) => {
  const Playlist = sequelize.define('Playlist', {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    guildId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    songs: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
  }, {
    freezeTableName: true,
  });

  Playlist.associate = (models) => {
    Playlist.belongsTo(models.Guild, {
      foreignKey: 'guildId',
      onDelete: 'CASCADE',
    });
  };

  return Playlist;
};