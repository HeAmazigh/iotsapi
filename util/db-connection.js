const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('redalertlabs','root','', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;