const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");


const Evaluatee_profile = sequelize.define("Evaluatee_profile", {
    id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.CHAR,
        allowNull: false,
    },
    employee_no: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    position_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    hire_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    create_at: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    update_at: {
        type: DataTypes.TIME,
        allowNull: false
    }
}, {
    tableName: "evaluatee_profiles",
    timestamps: false
})

module.exports = {
    Evaluatee_profile
}