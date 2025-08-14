const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");


const Roles = sequelize.define("Roles", {
    id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    tableName: "roles",
    timestamps: false
})

module.exports = {
    Roles
}