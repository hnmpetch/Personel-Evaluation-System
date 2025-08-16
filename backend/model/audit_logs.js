const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");


const Log = sequelize.define("Log", {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    logged_at: {
        type: DataTypes.TIME,
        allowNull: false
    },
    actor_id: {
        type: DataTypes.CHAR,
        allowNull: true
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    entity: {
        type: DataTypes.STRING,
        allowNull: false
    },
    entity_id: {
        type: DataTypes.UUIDV4,
        allowNull: true
    },
    details: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: true
    }
},{
    tableName: "audit_logs",
    timestamps: false
})

module.exports = {
    Log
}