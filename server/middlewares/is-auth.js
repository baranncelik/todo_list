const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    
    // 1. Header kontrolü
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token bulunamadı veya yanlış format!' });
    }

    const token = authHeader.split(' ')[1]; 
    let decodedToken;
    
    try {
        // Anahtarı kopyalayıp buraya tekrar yapıştırdığından emin ol
        decodedToken = jwt.verify(token, 'todo_list_kullanıcı_session_keyyyy!!!1');
    } catch (err) {
        // Terminale bak, hatanın nedenini (expired mı, signature mı) burası söyler
        console.error("JWT Verify Hatası:", err.message); 
        return res.status(401).json({ message: 'Yetkisiz erişim: Geçersiz token.' });
    }

    if (!decodedToken) {
        return res.status(401).json({ message: 'Giriş yapılmadı.' });
    }

    // Login olurken { userId: user.id } şeklinde paketlediğinden emin ol
    req.userId = decodedToken.userId;
    next();
};