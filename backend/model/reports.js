const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");


const Reports = sequelize.define("Reports", {
    id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    cycle_id: {
        type: DataTypes.CHAR,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parameter: {
        type: DataTypes.STRING,
        allowNull: true
    },
    generate_by : {
        type: DataTypes.CHAR,
        allowNull: false
    },
    file_path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    create_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
},{
    tableName: "reports",
    timestamps: false
})

module.exports = {
    Reports
}