const { Sequelize } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true }
        },
        firebase_uid: {
        type: DataTypes.STRING,
        allowNull: false
        }
        
    })
}