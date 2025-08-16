const { DataTypes, DATE } = require("sequelize");
const { sequelize } = require("../database");


const Exports = sequelize.define("Exports", {
    id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    cycle_id: {
        type: DataTypes.CHAR,
        allowNull: false
    },
    evaluatee_id: {
        type: DataTypes.CHAR,
        allowNull: false
    },
    format: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file_path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    request_by: {
        type: DataTypes.CHAR,
        allowNull: false
    },
    create_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
},{
    tableName: "exports",
    timestamps: false
})

module.exports = {
    Exports
}