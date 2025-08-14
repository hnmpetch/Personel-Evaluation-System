const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");


const Positions = sequelize.define("Positions", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: "positions",
    timestamps: false
})

module.exports = {
    Positions
}