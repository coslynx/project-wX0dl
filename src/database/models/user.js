const { Sequelize, DataTypes } = require('sequelize');
const { databaseConfig } = require('../../config/database');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    // Add any additional user-related fields here, such as:
    // username: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    // email: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // ...
  }, {
    freezeTableName: true,
  });

  // User.associate = (models) => {
  //   // Add any associations if necessary
  // };

  return User;
};