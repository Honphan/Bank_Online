import React, { useState, useEffect } from 'react';
import { getUserAccounts, exchangeMoney } from '../../../api/DashBoard/QuickActionApi';
import '../../../assets/styles/Dashboard/ExchangePage.css';

export default function ExchangePage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const loadAccounts = async () => {
    try {
      const list = await getUserAccounts();
      const normalized = (Array.isArray(list) ? list : (list?.data ?? [])).map((a, index) => ({
        id: a.id ?? index,
        name: a.accountType === 'CHECKING' ? 'Tài khoản chính' : 
              a.accountType === 'SAVINGS' ? 'Tài khoản tiết kiệm' : 
              a.accountType === 'USD' ? 'Tài khoản USD' : `Tài khoản ${a.accountType}`,
        balance: Number(a.balance ?? 0),
        accountNumber: String(a.accountNumber || a.number || ''),
        type: a.accountType === 'USD' ? 'USD' : 'VND',
        accountType: a.accountType
      }));
      setAccounts(normalized);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fromAccount || !form.toAccount || !form.amount) {
      setMessage({ type: 'error', text: 'Vui lòng điền đầy đủ thông tin' });
      return;
    }
    if (form.fromAccount === form.toAccount) {
      setMessage({ type: 'error', text: 'Tài khoản nguồn và đích không được giống nhau' });
      return;
    }
    if (Number(form.amount) <= 0) {
      setMessage({ type: 'error', text: 'Số tiền phải lớn hơn 0' });
      return;
    }

    setSubmitting(true);
    try {
      // TODO: Gọi API chuyển đổi thực tế
      console.log(form);
      await exchangeMoney(form); 
      setMessage({ type: 'success', text: 'Chuyển đổi thành công!' });
      setForm({ fromAccount: '', toAccount: '', amount: '', description: '' });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
      // Tự động reload danh sách tài khoản sau khi chuyển tiền thành công
      await loadAccounts();
    } catch (e) {
      setMessage({ type: 'error', text: e.message || 'Chuyển đổi thất bại' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="exchange-loading"><div className="loading-spinner"></div></div>;
  }

  if (error) {
    return <div className="exchange-error">{error}</div>;
  }

  return (
    <div className="exchange-container">
      <div className="exchange-header">
        <h3>Chuyển đổi giữa các tài khoản</h3>
        <p>Chuyển tiền giữa tài khoản chính, tiết kiệm và USD</p>
      </div>

      {message && (
        <div className={`exchange-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="exchange-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Tài khoản nguồn</label>
            <select
              className="form-select"
              value={form.fromAccount}
              onChange={(e) => handleChange('fromAccount', e.target.value)}
              required
            >
              <option value="">Chọn tài khoản nguồn</option>
              {accounts.map(account => (
                <option key={account.id} value={account.accountType}>
                  {account.name} - {account.balance.toLocaleString('vi-VN')} {account.type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Tài khoản đích</label>
            <select
              className="form-select"
              value={form.toAccount}
              onChange={(e) => handleChange('toAccount', e.target.value)}
              required
            >
              <option value="">Chọn tài khoản đích</option>
              {accounts.map(account => (
                <option key={account.id} value={account.accountType}>
                  {account.name} - {account.balance.toLocaleString('vi-VN')} {account.type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Số tiền</label>
            <input
              type="number"
              className="form-input"
              value={form.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="Nhập số tiền"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả (tùy chọn)</label>
            <input
              type="text"
              className="form-input"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Ghi chú cho giao dịch"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="exchange-btn"
            disabled={submitting}
          >
            {submitting ? 'Đang xử lý...' : 'Chuyển đổi'}
          </button>
        </div>
      </form>

      <div className="exchange-info">
        <h4>Thông tin tài khoản</h4>
        <div className="accounts-list">
          {accounts.map(account => (
            <div key={account.id} className="account-item">
              <div className="account-info">
                <span className="account-name">{account.name}</span>
                <span className="account-number">****{account.accountNumber.slice(-4)}</span>
              </div>
              <div className="account-balance">
                {account.balance.toLocaleString('vi-VN')} {account.type}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}