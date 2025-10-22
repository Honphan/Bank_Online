import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/authApi';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('roles');
    if (token) {
      if (role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      const data = res.data;
      alert(res.message + ", status: " + res.status); // Hiển thị thông báo đăng nhập thành công
      console.log(data); // Lưu token nếu cần
  // Lấy token từ response (hỗ trợ cả accessToken hoặc token)
  const token = data?.accessToken || data?.token;
  if (!token) {
    setError('Không nhận được token từ máy chủ');
    return;
  }

  // Lưu token để App.jsx có thể redirect và interceptor có thể dùng
  localStorage.setItem('token', token);
  localStorage.setItem('roles', data.roles[0]); // Lưu role đầu tiên

  // Lưu thêm refreshToken và user nếu backend trả về (Spring Boot)
  if (data?.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
  if (data?.user) localStorage.setItem('userInfo', JSON.stringify(data.user));

  // Chuyển hướng theo role
  const role = data.role || data.roles?.[0];
  console.log("role: " + role);
  if(role === 'ROLE_ADMIN') {
    console.log("oke");
    navigate('/admin/dashboard', { replace: true });
  } else {
    navigate('/dashboard', { replace: true });
  }
} catch (err) {   
      setError(err.message); // Hiển thị lỗi nếu đăng nhập thất bại
    }
  };

  return (
    <div className="form-container">
      <h2>Đăng nhập</h2>
      {error && <p className="form-error">{error}</p>}
      <form onSubmit={handleLogin}>
        
        <div>
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="form-input"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="form-input"
          />
        </div>
          <button type="submit" className="btn-primary">
            Đăng nhập
          </button>
        
      </form>
      
      <div className="form-footer">
        <p>Chưa có tài khoản? <Link to="/register" className="register-link">Đăng ký ngay</Link></p>
      </div>
    </div>
  );
}