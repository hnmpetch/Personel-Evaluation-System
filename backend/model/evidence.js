const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");


const Evidences = sequelize.define("Evidences", {
    id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    cycle_id: {
        type: DataTypes.CHAR,
        allowNull: false,
    },
    evaluatee_id: {
        type: DataTypes.CHAR,
        allowNull: false,
    },
    indicator_id: {
        type: DataTypes.CHAR,
        allowNull: false
    },
    owner_user_id: {
        type: DataTypes.CHAR,
        allowNull: false
    },
    kind: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file_path: {
        type: DataTypes.STRING,
        allowNull: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    uploaded_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
},{
    tableName: "evidences",
    timestamps: false
})

module.exports = {
    Evidences
}