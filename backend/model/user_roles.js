const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");


const User_roles = sequelize.define("Users_role", {
    user_id: {
        type: DataTypes.CHAR,
        allowNull: false,
        primaryKey: true,
    },
    roles_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        key: true,
    }
},{
    tableName: "user_roles",
    timestamps: true,
    createdAt: "create_at"
})

module.exports = {
    User_roles
}