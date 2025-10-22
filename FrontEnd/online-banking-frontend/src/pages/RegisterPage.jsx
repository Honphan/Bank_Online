import React, { useState } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import '../assets/styles/register.css';
import { register, socialRegister } from '../api/authApi';
/**
 * @component RegisterForm
 * @description Form đăng ký viết bằng ReactJS (JSX)
 */
export default function RegisterForm() {
    const navigate = useNavigate(); // Khởi tạo hook useNavigate
  const [form, setForm] = useState({
    fullname: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({
    fullname: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: '',
  });

  const validateForm = () => {
    let newErrors = {
      fullname: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeTerms: '',
    };
    let isValid = true;

    if (!form.fullname.trim()) {
      newErrors.fullname = 'Vui lòng nhập họ và tên';
      isValid = false;
    }

    if (!form.username.trim()) {
      newErrors.username = 'Vui lòng nhập tên người dùng';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Email không hợp lệ';
      isValid = false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!form.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
      isValid = false;
    } else if (!phoneRegex.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
      isValid = false;
    } else if (form.password.length < 1) {
      newErrors.password = 'Mật khẩu phải có ít nhất 11 ký tự';
      isValid = false;
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
      isValid = false;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
      isValid = false;
    }

    if (!form.agreeTerms) {
      newErrors.agreeTerms = 'Vui lòng đồng ý với điều khoản';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
  if (validateForm()) {
    try {
      // Gọi API đăng ký
      const response = await register({
        fullName: form.fullname,
        username: form.username,
        email: form.email,
        phoneNumber: form.phone,
        password: form.password
      });
      
      // Xử lý khi đăng ký thành công
      alert('Đăng ký thành công!');
      console.log('Kết quả đăng ký:', response);
       // Reset form
      setForm({
        fullname: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
      });
      
      // Chuyển hướng người dùng (nếu cần)
      // navigate('/login');
      navigate('/login');

    } catch (error) {
      // Xử lý lỗi
      alert(error.message);
    }
  }
};
const handleSocialLogin = async (provider) => {
  try {
    // Logic xác thực với provider (Google hoặc Facebook)
    // Thông thường cần sử dụng thư viện OAuth riêng cho mỗi provider
    
    // Giả định dữ liệu xác thực từ OAuth provider
    const authData = { token: 'oauth-token-here', /* các thông tin khác */ };
    
    const response = await socialRegister(provider.toLowerCase(), authData);
    console.log(`Đăng ký với ${provider} thành công:`, response);
    
    // Xử lý sau khi đăng ký thành công
    alert(`Đăng ký với ${provider} thành công!`);
  } catch (error) {
    alert(error.message);
  }
};

  return (
    <div className="form-container">
      <h2>Đăng ký tài khoản</h2>
      <p className="form-help" style={{ textAlign: 'center', marginBottom: '20px' }}>
        Tạo tài khoản mới để sử dụng dịch vụ ngân hàng trực tuyến
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
      >
         {/* fullname */}
        <div>
          <input
            type="text"
            placeholder="Họ và tên"
            value={form.fullname}
            onChange={(e) => setForm({ ...form, fullname: e.target.value })}
            className="form-input"
          />
          {errors.fullname && <p className="form-error">{errors.fullname}</p>}
        </div>
        {/* username */}
        <div>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="form-input"
          />
          {errors.username && <p className="form-error">{errors.username}</p>}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="form-input"
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        {/* Số điện thoại */}
        <div>
          <input
            type="text"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="form-input"
          />
          {errors.phone && <p className="form-error">{errors.phone}</p>}
        </div>

        {/* Mật khẩu */}
        <div>
          <input
            type="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="form-input"
          />
          {errors.password && <p className="form-error">{errors.password}</p>}
        </div>

        {/* Xác nhận mật khẩu */}
        <div>
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="form-input"
          />
          {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
        </div>

        {/* Checkbox đồng ý điều khoản */}
        <label className="form-checkbox">
          <input
            type="checkbox"
            checked={form.agreeTerms}
            onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
          />
          <span>Tôi đồng ý với <a href="#" style={{ color: 'var(--primary)' }}>điều khoản sử dụng</a></span>
        </label>
        {errors.agreeTerms && <p className="form-error">{errors.agreeTerms}</p>}

        {/* Button đăng ký */}
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <button type="submit" className="btn-primary">
            Đăng ký tài khoản
          </button>
        </div>
       

        {/* Social login buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button
            type="button"
            onClick={() => handleSocialLogin('Google')}
            className="btn-social"
            style={{ flex: 1 }}
          >
            📧 Google
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin('Facebook')}
            className="btn-social"
            style={{ flex: 1 }}
          >
            📘 Facebook
          </button>
        </div>

        <p className="form-help" style={{ textAlign: 'center', marginTop: '16px',justifyContent: 'center'  }}>
          Đã có tài khoản? <Link to="/login" style={{ color: 'var(--primary)' }}>Đăng nhập ngay</Link>
        </p>
      </form>
    </div>
  );
}

