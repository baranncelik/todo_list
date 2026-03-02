const Todo_element = require("../models/todo_elements");
const User = require("../models/users");

exports.getHome = async (req, res, next) => {
    try {
        const userId = req.userId;
        
        if (!userId) {
            return res.status(401).json({ message: "Yetkisiz istek." });
        }

        const todos = await Todo_element.findAll({ 
            where: { userId : userId },
            order: [['createdAt', 'DESC']] 
        });

        const user = await User.findByPk(userId); 
        
        if(!user){
            return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }

        return res.status(200).json({
            todo_element: todos || [], 
            username: user.username 
        });

    } catch (err) {
        console.error("Hata (getHome):", err);
        return res.status(500).json({ message: "Veriler çekilirken sunucu hatası oluştu." });
    }
};

exports.postHome = async(req, res, next) => {
    const { task_name } = req.body;
    
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Yetkisiz istek." });
        }

        if (!task_name || task_name.trim() === "") {
            return res.status(400).json({ message: "Görev adı boş olamaz." });
        }

        const new_todo = await Todo_element.create({
            task_name: task_name,
            isOk: false, 
            userId: req.userId
        });

        return res.status(201).json({
            message: "Görev başarıyla veritabanına kaydedildi.",
            todo: new_todo
        });

    } catch(err){
        console.error("Hata (postHome):", err);
        return res.status(500).json({ message: "Kayıt sırasında sunucu hatası oluştu." });
    }
};

exports.putHome = async (req, res, next) => {
    const todoId = req.params.id; 
    const { task_name, isOk } = req.body;
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Yetkisiz istek." });
        }

        const todo = await Todo_element.findOne({ 
            where: { id: todoId, userId: req.userId } 
        });

        if (!todo) {
            return res.status(404).json({ message: "Görev bulunamadı veya yetkiniz yok." });
        }

        if (task_name !== undefined) todo.task_name = task_name;
        if (isOk !== undefined) todo.isOk = isOk; 
        await todo.save(); 
        return res.status(200).json({
            message: "Veritabanı güncellendi.",
            todo: todo
        });

    } catch (err) {
        console.error("Hata (putHome):", err);
        return res.status(500).json({ message: "Güncelleme hatası." });
    }
};

exports.deleteHome = async (req, res, next) => {
    const todoId = req.params.id;

    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Yetkisiz istek." });
        }

        const result = await Todo_element.destroy({
            where: { id: todoId, userId: req.userId }
        });

        if (result === 0) {
            return res.status(404).json({ message: "Görev silinemedi (Yetki yok veya ID yanlış)." });
        }

        return res.status(200).json({ message: "Görev veritabanından başarıyla silindi." });

    } catch (err) {
        console.error("Hata (deleteHome):", err);
        return res.status(500).json({ message: "Silme işlemi başarısız." });
    }
};