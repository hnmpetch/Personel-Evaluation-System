const { sequelize } = require('../database.js');
const { DataTypes } = require('sequelize');

const Self_assessment_items = sequelize.define(" Self_assessment_items", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    evaluatee_id: {
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
    tableName: 'self_assessment_items',
    timestamps: true,
    createdAt: "create_at",
})

module.exports = {
    Self_assessment_items
}