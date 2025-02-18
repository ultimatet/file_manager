module.exports = (sequelize, Sequelize) => {
    const File = sequelize.define("File",{
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
        },
        user_id: {  // ✅ Ensure user_id is optional
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "users",
                key: "id",
            },
        },
        },
        {
            tableName: "files", // ✅ Explicitly set lowercase table name
            timestamps: true,  // ✅ Disable timestamps if not needed
        }
    );

    File.associate = (models) => {
        File.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return File;
};
