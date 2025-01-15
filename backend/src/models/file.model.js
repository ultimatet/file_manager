const { Sequelize } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const File = sequelize.define("file", {
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
        
    })
}