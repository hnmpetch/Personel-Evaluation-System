const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");


const Departments = sequelize.define("Departments", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    tableName: "departments",
    timestamps: false
})

module.exports = {
    Departments
}