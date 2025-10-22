import React, { useEffect, useState } from 'react';
import { getUserInfo, updateUserProfile, changePassword } from '../../../api/DashBoard/QuickActionApi';
import '../../../assets/styles/Dashboard/Profile.css';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const [showChangePw, setShowChangePw] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getUserInfo();
        const me = res.data;
        setUser({
          fullName: me.fullName ?? me.fullname ?? '',
          email: me.email ?? '',
          phoneNumber: me.phoneNumber ?? me.phone ?? '',
          address: me.address ?? '',
          dateOfBirth: me.dateOfBirth ?? me.dob ?? '' // yyyy-MM-dd nếu BE trả đúng định dạng
        });
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const clearNotice = () => {
    setMsg(null);
    setErr(null);
  };

  // Cập nhật field ngay khi người dùng thay đổi (save-on-blur để tránh spam API)
  const handleChange = (key, value) => {
    clearNotice();
    setUser(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSaveAll = async () => {
    if (!user) return;
    clearNotice();
    // Validate cơ bản
    if (!user.fullName) { setErr('Vui lòng nhập họ và tên'); return; }
    if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) { setErr('Email không hợp lệ'); return; }
    setSaving(true);
    try {
      const payload = {
        fullName: user.fullName ?? '',
        email: user.email ?? '',
        phoneNumber: user.phoneNumber ?? '',
        address: user.address ?? '',
        dateOfBirth: user.dateOfBirth ?? ''
      };
      const updated = await updateUserProfile(payload);
      setMsg('Đã lưu thông tin cá nhân');
      setUser(prev => ({
        ...prev,
        fullName: updated.fullName ?? updated.fullname ?? prev.fullName,
        email: updated.email ?? prev.email,
        phoneNumber: updated.phoneNumber ?? updated.phone ?? prev.phoneNumber,
        address: updated.address ?? prev.address,
        dateOfBirth: updated.dateOfBirth ?? updated.dob ?? prev.dateOfBirth
      }));
      setHasChanges(false);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  const getPwValidationError = () => {
    if (!pwForm.currentPassword) return 'Vui lòng nhập mật khẩu hiện tại';
    if (!pwForm.newPassword) return 'Vui lòng nhập mật khẩu mới';
    if (pwForm.newPassword.length < 6) return 'Mật khẩu mới tối thiểu 6 ký tự';
    if (!pwForm.confirmNewPassword) return 'Vui lòng nhập lại mật khẩu mới';
    if (pwForm.newPassword !== pwForm.confirmNewPassword) return 'Nhập lại mật khẩu không khớp';
    if (pwForm.newPassword === pwForm.currentPassword) return 'Mật khẩu mới phải khác mật khẩu hiện tại';
    return null;
  };

  const submitChangePassword = async (e) => {
    e.preventDefault();
    clearNotice();
    const validationError = getPwValidationError();
    if (validationError) { setErr(validationError); return; }
    setPwSaving(true);
    try {
      await changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword
      });
      setMsg('Đổi mật khẩu thành công');
      setPwForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setShowChangePw(false);
    } catch (e) {
      setErr(e.message || 'Đổi mật khẩu thất bại');
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="loading-spinner"></div></div>;
  }

  if (!user) {
    return <div className="error-message">Không tải được thông tin người dùng</div>;
  }

  return (
    <div className="profile-card">
      <div className="profile-header">
        <h4 className="profile-title">Thông tin cá nhân</h4>
      </div>

      {msg && <div className="success-message">{msg}</div>}
      {err && <div className="error-message">{err}</div>}

      <div className="profile-grid" style={{ marginTop: 16 }}>
        <div className="profile-field">
          <label className="profile-label">Full Name</label>
          <input
            type="text"
            className="profile-input"
            value={user.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Nhập họ tên"
          />
        </div>

        <div className="profile-field">
          <label className="profile-label">Email</label>
          <input
            type="email"
            className="profile-input"
            value={user.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="email@example.com"
          />
        </div>

        <div className="profile-field">
          <label className="profile-label">Số điện thoại</label>
          <input
            type="tel"
            className="profile-input"
            value={user.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            placeholder="0123456789"
          />
        </div>

        <div className="profile-field">
          <label className="profile-label">Địa chỉ</label>
          <input
            type="text"
            className="profile-input"
            value={user.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Số nhà, đường, TP..."
          />
        </div>

        <div className="profile-field">
          <label className="profile-label">Ngày sinh</label>
          <input
            type="date"
            className="profile-input"
            value={user.dateOfBirth ? String(user.dateOfBirth).slice(0,10) : ''}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
          />
        </div>
      </div>

      <div className="notice-row" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn-primary" onClick={handleSaveAll} disabled={!hasChanges || saving}>
            {saving ? 'Đang lưu...' : 'Lưu thông tin'}
          </button>
          {hasChanges && !saving && <span className="inline-hint">Bạn có thay đổi chưa lưu</span>}
        </div>
        <button
          className="btn-outline"
          onClick={() => setShowChangePw(v => !v)}
          disabled={saving}
        >
          {showChangePw ? 'Đóng đổi mật khẩu' : 'Thay đổi mật khẩu'}
        </button>
      </div>

      {showChangePw && (
        <form onSubmit={submitChangePassword} className="password-form">
          <div className="password-grid">
            <div className="profile-field">
              <label className="profile-label">Mật khẩu hiện tại</label>
              <input
                type="password"
                className="profile-input"
                value={pwForm.currentPassword}
                onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                placeholder="Nhập mật khẩu hiện tại"
                autoComplete="current-password"
              />
            </div>
            <div className="profile-field">
              <label className="profile-label">Mật khẩu mới</label>
              <input
                type="password"
                className="profile-input"
                value={pwForm.newPassword}
                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                placeholder="Tối thiểu 6 ký tự"
                autoComplete="new-password"
              />
            </div>
            <div className="profile-field">
              <label className="profile-label">Nhập lại mật khẩu mới</label>
              <input
                type="password"
                className="profile-input"
                value={pwForm.confirmNewPassword}
                onChange={(e) => setPwForm({ ...pwForm, confirmNewPassword: e.target.value })}
                placeholder="Nhập lại mật khẩu mới"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary" disabled={pwSaving}>
              {pwSaving ? 'Đang đổi...' : 'Xác nhận đổi mật khẩu'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
