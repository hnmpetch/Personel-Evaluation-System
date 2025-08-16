const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");


const Indicator = sequelize.define("Indicator", {
    id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    cycle_id: {
        type: DataTypes.CHAR,
        allowNull: false
    },
    topic_id: {
        type: DataTypes.CHAR,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    detail: {
        type: DataTypes.STRING,
        allowNull: true
    },
    weight: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    scoring_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    evidence_type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    require_evidence: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    display_order: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    tableName: "indicators",
    timestamps: false
})

module.exports = {
    Indicator
}