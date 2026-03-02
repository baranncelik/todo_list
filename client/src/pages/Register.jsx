import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; 

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Şifreler uyuşmuyor!");
      return;
    }

    try {
      const response = await fetch('https://socialmapper.xyz/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate('/login'); 
      } else {
        alert(data.message || "Kayıt sırasında bir hata oluştu.");
      }
    } catch (error) {
      console.error("Bağlantı Hatası:", error);
      alert("Sunucuya bağlanılamadı. Backend'in çalıştığından emin ol.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Yeni Hesap Oluştur</h2>
        <p className="login-subtitle">Aramıza katıl ve todolarını yönetmeye başla.</p>
        
        <form className="login-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label>Kullanıcı Adı</label>
            <input name="username" type="text" placeholder="kullanici_adi" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>E-posta</label>
            <input name="email" type="email" placeholder="ornek@mail.com" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Şifre</label>
            <input name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Şifre Tekrar</label>
            <input name="confirmPassword" type="password" placeholder="••••••••" onChange={handleChange} required />
          </div>

          <button type="submit" className="login-btn">Kayıt Ol</button>
        </form>

        <p className="register-text">
          Zaten bir hesabın var mı? <Link to="/login" className="register-link">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;