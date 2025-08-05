const { sequelize } = require('../database.js');
const { DataTypes } = require('sequelize');

const task = sequelize.define("Task", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pe: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pv: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    point: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    point_avg: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    discription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    signature: {
        type: DataTypes.STRING,
        allowNull: false
    },
    succes: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    create_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    update_at: {
        type: DataTypes.TIME,
        allowNull: false
    }
},{
    tableName: 'task',
    timestamps: false
})

module.exports = {
    task
}