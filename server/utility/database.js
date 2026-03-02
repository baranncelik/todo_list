const Sequelize = require("sequelize");

const sequelize = new Sequelize("todo_list_db","todo_user","BaranCelik!48650913",{
    dialect : "mysql",
    host : "localhost",
    timezone : "+03:00"
});

module.exports = sequelize;