const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");


const Signatures = sequelize.define("Signatures", {
    id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    assessments_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    signer_id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        unique: true
    },
    signed_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date().getTime().toString()
    },
    signature_path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: true
    },

},{
    tableName: "signatures",
    timestamps: true,
    createdAt: "create_at"
})

module.exports = {
    Signatures
}