const sequelize = require("../utility/database");
const { DataTypes } = require("sequelize");

const Todo_element = sequelize.define("todo_element", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true 
    },
    task_name: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    isOk: {
        type: DataTypes.BOOLEAN, 
        defaultValue: false,     
        allowNull: false
    },

});

module.exports = Todo_element;