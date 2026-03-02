const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const userRoutes = require("./routes/home");
const sequelize = require("./utility/database");
const authRoutes = require("./routes/auth")
const User = require("./models/users");
const Todo_element = require("./models/todo_elements");

app.use(cors());
app.use(express.json());


app.use("/api", userRoutes);
app.use("/api" , authRoutes)


User.hasMany(Todo_element);
Todo_element.belongsTo(User);


sequelize
    .authenticate()
    .then(() => {
        console.log("Database bağlantısı başarılı.");
        return sequelize.sync({ alter: true }); 
    })
    .then(() => {
        console.log("Tablolar güncellendi/oluşturuldu.");
    })
    .catch((err) => {
        console.error("Veritabanı hatası:", err);
    });


const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server ${PORT} portunda çalışıyor.`);
});