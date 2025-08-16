const { sequelize } = require('../database.js');
const { DataTypes } = require('sequelize');

const self_assessments = sequelize.define("Self Assessments", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    cycle_id: {
        type: DataTypes.CHAR,
        allowNull: false,
    },
    evaluatee_id: {
        type: DataTypes.CHAR,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: true
    },
    
},{
    tableName: 'self_assessments',
    timestamps: true,
    createdAt: "create_at",
    updatedAt: "update_at"
})

module.exports = {
    self_assessments
}