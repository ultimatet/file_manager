module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
        user_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false, 
        },
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
            foreignKey: 'user_id',
            as: 'files'
            });
    };

    return User;
}

