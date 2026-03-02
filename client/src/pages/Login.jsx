import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Yükleniyor durumu için
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Giriş işlemi başladı

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // --- KRİTİK NOKTA: Backend'den gelen GERÇEK verileri kaydediyoruz ---
        localStorage.setItem('token', data.token); // JWT artık cüzdanda!
        localStorage.setItem('username', data.username); // İsim lazım olur
        localStorage.setItem('userId', data.userId);
        
        // Başarılı girişten sonra ana sayfaya yönlendir
        navigate('/'); 
      } else {
        // Backend'den gelen hata mesajını göster (Örn: "Şifre yanlış")
        alert(data.message || "Giriş başarısız.");
      }
    } catch (error) {
      console.error("Giriş hatası:", error);
      alert("Sunucuya bağlanılamadı. Lütfen Backend'in çalıştığından emin ol.");
    } finally {
      setLoading(false); // İşlem bitti
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Hoş Geldin!</h2>
        <p className="login-subtitle">Lütfen hesap bilgilerini girerek devam et.</p>
        
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>E-posta Adresi</label>
            <input 
              type="email" 
              placeholder="email@gmail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label>Şifre</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required
              disabled={loading}
            />
          </div>

          <div className="form-footer">
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: '16px', height: '16px' }} /> Beni Hatırla
            </label>
            <Link to="/forgot-password" className="forgot-password">Şifremi Unuttum?</Link>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <p className="register-text">
          Henüz bir hesabın yok mu? <Link to="/register" className="register-link">Hemen Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;