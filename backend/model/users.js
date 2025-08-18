const { DataTypes } = require('sequelize');
const { sequelize } = require('../database.js');

const User = sequelize.define('Users', {
    id: {
        type: DataTypes.CHAR,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    full_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull:false
    },
    create_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    update_at: {
        type: DataTypes.TIME,
        allowNull: true
    }
},{
    tableName: 'users',
    timestamps: false
})

module.exports = {
    User
}