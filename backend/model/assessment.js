const { sequelize } = require('../database.js');
const { DataTypes } = require('sequelize');

const assessment = sequelize.define("Assess", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    header: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    discription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
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
    tableName: 'assessment',
    timestamps: false
})

module.exports = {
    assessment
}