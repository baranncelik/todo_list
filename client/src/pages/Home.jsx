import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [todos, setTodos] = useState([]);
  const [userName, setUserName] = useState("Kullanıcı");
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const navigate = useNavigate();

  // --- KRİTİK: Sayfa açıldığında verileri çeken motor ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchTodos();
    }
  }, []); // Component yüklendiğinde bir kez çalışır

  const getHeaders = () => {
    const activeToken = localStorage.getItem('token');
    if (!activeToken || activeToken === "null") return { 'Content-Type': 'application/json' };

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${activeToken}` // Aradaki boşluk hayati önem taşır
    };
  };

  const fetchTodos = async () => {
    try {
      const response = await fetch('https://socialmapper.xyz/api/home', {
        headers: getHeaders()
      });
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        return navigate('/login');
      }

      const data = await response.json();
      setTodos(data.todo_element || []); 
      setUserName(data.username || "Kullanıcı");
    } catch (err) {
      console.error("Veri çekme hatası:", err);
    }
  };

  const addTodo = async () => {
    if (inputValue.trim() === "") return;
    try {
      const response = await fetch('https://socialmapper.xyz/api/home', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ task_name: inputValue, isOk: false })
      });
      if (response.ok) {
        setInputValue("");
        fetchTodos(); 
      }
    } catch (err) {
      console.error("Ekleme hatası:", err);
    }
  };

const toggleComplete = async (todo) => {
  await fetch(`https://socialmapper.xyz/api/home/${todo.id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ isOk: !todo.isOk }) // Mevcut durumun tersini gönder (false -> true yapar)
  });
  fetchTodos(); // Listeyi yenileyince veritabanındaki son hali ekrana gelir
};

  const saveEdit = async (id) => {
    try {
      await fetch(`https://socialmapper.xyz/api/home/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ task_name: editText })
      });
      setEditingId(null);
      fetchTodos();
    } catch (err) {
      console.error("Düzenleme hatası:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`https://socialmapper.xyz/api/home/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      fetchTodos();
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear(); // Tüm verileri temizle (token, username vs.)
    navigate('/login');
  };

  return (
    <div className="home-container">
      <div className="todo-header">
        <div className="header-top">
           <h1>Yapılacaklar Listem</h1>
           <button className="logout-btn" onClick={handleLogout}>Çıkış Yap</button>
        </div>
        <p className="todo-subtitle">Merhaba <strong>{userName}</strong>. Bugün neler yapacaksın?</p>
      </div>

      <form className="todo-add-form" onSubmit={(e) => { e.preventDefault(); addTodo(); }}>
        <div className="input-group">
          <input 
            type="text" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            placeholder="Yeni bir görev yaz ve Enter'a bas..."
            required
          />
          <button type="submit" className="add-btn">Ekle</button>
        </div>
      </form>

      <ul className="todo-list">
        {todos.length === 0 ? (
          <p className="empty-message">Henüz bir görev yok, eklemeye ne dersin?</p>
        ) : (
          todos.map((todo) => (
            <li key={todo.id} className={todo.isOk ? "todo-item completed" : "todo-item"}>
              <div className="todo-left">
                <input 
                  type="checkbox" 
                  checked={todo.isOk}
                  onChange={() => toggleComplete(todo)} 
                />
                {editingId === todo.id ? (
                  <input 
                    type="text" 
                    value={editText} 
                    onChange={(e) => setEditText(e.target.value)}
                    className="edit-input"
                    autoFocus
                  />
                ) : (
                  <span className="todo-text">{todo.task_name}</span>
                )}
              </div>
              <div className="todo-actions">
                {editingId === todo.id ? (
                  <button className="save-btn" onClick={() => saveEdit(todo.id)}>Kaydet</button>
                ) : (
                  <button className="edit-btn" onClick={() => { setEditingId(todo.id); setEditText(todo.task_name); }}>Düzenle</button>
                )}
                <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>Sil</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Home;