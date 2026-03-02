const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.postRegister = async (req, res, next) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Şifreleriniz uyuşmuyor." });
    }

    try {
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ message: "Bu e-posta adresi zaten kullanımda." });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await User.create({
            username: username,
            email: email,
            password: hashedPassword
        });

        return res.status(201).json({ message: "Kaydınız başarıyla oluşturuldu." });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Sunucu hatası oluştu." });
    }
};

exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email: email } });
        
        if (!user) {
            return res.status(400).json({ message: "Böyle bir kullanıcı bulunmamaktadır." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ message: "Şifreniz hatalıdır. Lütfen tekrar deneyiniz." });
        }
        const token = jwt.sign(
        { userId: user.id, email: user.email }, 
        'todo_list_kullanıcı_session_keyyyy!!!1', 
        { expiresIn: '100h' } 
    );

        return res.status(200).json({
        token: token,
        userId: user.id,
        username: user.username
    });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Sunucu hatası oluştu." });
    }
};



