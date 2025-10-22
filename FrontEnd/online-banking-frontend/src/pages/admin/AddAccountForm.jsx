import React from 'react';
import { useState } from 'react';
import { addUserAccount } from '../../api/AdminDashboardApi';

const AddAccountForm = ({ loading, goBack , setLoading, setMessage }) => {
    const [accountForm, setAccountForm] = useState({
      username: '',
      email: '',
      phoneNumber: '',
      fullName: '',
      password: '',
      role: 'ROLE_USER'
    });

   const handleAddAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await addUserAccount(accountForm);
      console.log(res);
      console.log('Adding account:', accountForm);
      setMessage({ type: 'success', text: 'Thêm tài khoản thành công!' });
      setAccountForm({ username: '', email: '', phoneNumber: '', fullName: '', password: '', role: 'USER' });
    } catch  {
      setMessage({ type: 'error', text: 'Thêm tài khoản thất bại' });
    } finally {
      setLoading(false);
    }
  };
  return (
  <div className="admin-section">
    <div className="section-header">
      <h3>Thêm tài khoản mới</h3>
      <button className="btn-secondary" onClick={goBack}>
        Quay lại
      </button>
    </div>
    <form onSubmit={handleAddAccount} className="admin-form">
      <div className="form-row">
        <div className="form-group">
          <label>Username</label>
          <input type="text" value={accountForm.username}
            onChange={e => setAccountForm({ ...accountForm, username: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={accountForm.email}
            onChange={e => setAccountForm({ ...accountForm, email: e.target.value })} required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Họ và tên</label>
          <input type="text" value={accountForm.fullName}
            onChange={e => setAccountForm({ ...accountForm, fullName: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Số điện thoại</label>
          <input type="tel" value={accountForm.phoneNumber}
            onChange={e => setAccountForm({ ...accountForm, phoneNumber: e.target.value })} required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Mật khẩu</label>
          <input type="password" value={accountForm.password}
            onChange={e => setAccountForm({ ...accountForm, password: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Vai trò</label>
          <select value={accountForm.role} onChange={e => setAccountForm({ ...accountForm, role: e.target.value })}>
            <option value="ROLE_USER">Người dùng</option>
            <option value="ROLE_ADMIN">Quản trị viên</option>
          </select>
        </div>
      </div>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Đang thêm...' : 'Thêm tài khoản'}
      </button>
    </form>
  </div>
);
};

export default AddAccountForm;
