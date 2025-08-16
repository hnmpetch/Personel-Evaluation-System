const { sequelize } = require('../database.js');
const { DataTypes } = require('sequelize');

const Committee_assignments = sequelize.define("Committee_assignments", {
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
    evaluator_id: {
        type: DataTypes.CHAR,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    assigned_id: {
        type: DataTypes.CHAR,
        allowNull: false,
    },
    
},{
    tableName: 'committee_assignments',
    timestamps: true,
    createdAt: "create_at",
    updatedAt: "update_at"
})

module.exports = {
    Committee_assignments
}