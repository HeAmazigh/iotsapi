const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../util/db-connection');

const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    firstname: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'users',
    createdAt: true,
    updatedAt: true 
});

module.exports = User;
