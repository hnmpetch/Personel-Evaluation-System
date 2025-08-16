const { sequelize } = require('../database.js');
const { DataTypes } = require('sequelize');

const Assessment_items = sequelize.define("Assessment items", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    assessment_id: {
        type: DataTypes.CHAR,
        allowNull: false
    },
    indicator_id:{
        type: DataTypes.CHAR,
        allowNull: false
    },
    score:{
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: true
    },
    
},{
    tableName: 'assessment_items',
    timestamps: true,
    createdAt: "create_at",
})

module.exports = {
    Assessment_items
}