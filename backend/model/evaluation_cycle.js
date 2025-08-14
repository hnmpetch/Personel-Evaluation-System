const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");


const Evaluation_cycle = sequelize.define("Evaluation_cycle", {
    id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    start_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    is_open: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    create_by: {
        type: DataTypes.STRING,
        allowNull:false
    }
},{
    tableName: "evaluation_cycles",
    timestamps: false
})

module.exports = {
    Evaluation_cycle
}