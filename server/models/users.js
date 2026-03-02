const sequelize = require("../utility/database");
const {Sequelize , DataTypes} = require("sequelize");

const User = sequelize.define("user",{
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true,
        allowNull : false
    },
    username : {
        type : DataTypes.STRING,
    },
    email : {
        type : DataTypes.STRING,
    },
    password : {
        type : DataTypes.STRING,
    }
})

module.exports = User;