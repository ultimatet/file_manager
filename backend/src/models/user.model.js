const { Sequelize } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
        email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { isEmail: true }
        },
        firebase_uid: {
        type: Sequelize.STRING,
        allowNull: false
        }
        
    });
    User.associate = (models) => {
        User.hasMany(models.File, {
            foreignKey: 'userId',
            as: 'files'
            });
    };

    return User;
}

