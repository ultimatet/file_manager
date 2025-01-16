module.exports = (sequelize, Sequelize) => {
    const File = sequelize.define("File", {
        file_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false, 
        },
        file_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        firebase_url: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        mime_type: {
            type: Sequelize.STRING,
        }
    });
    File.associate = (models) => {
        File.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
            });
    };
    return File;
}