import React, { useState, useEffect } from 'react';
import { getUserAccounts, transferToExternal, getAccountByNumber } from '../../../api/DashBoard/QuickActionApi';
import '../../../assets/styles/Dashboard/TransferPage.css';

export default function TransferPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    fromAccount: '',
    toAccountNumber: '',
    toAccountName: '',
    amount: '',
    description: '',
    transferType: 'internal' // internal hoặc external
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [accountVerified, setAccountVerified] = useState(false);

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

  const handleAccountNumberChange = (accountNumber) => {
    setForm(prev => ({ ...prev, toAccountNumber: accountNumber }));
    setMessage(null);
    setAccountVerified(false);
    setForm(prev => ({ ...prev, toAccountName: '' }));
  };

  const handleVerifyAccount = async () => {
    if (!form.toAccountNumber || form.toAccountNumber.length < 8) {
      setMessage({ 
        type: 'error', 
        text: 'Vui lòng nhập số tài khoản (tối thiểu 8 ký tự)' 
      });
      return;
    }

    setLoadingAccount(true);
    setMessage(null);
    try {
      const accountInfo = await getAccountByNumber(form.toAccountNumber);
      console.log(accountInfo);
      if (accountInfo.status === 404) {
        throw new Error("Không tìm thấy tài khoản");
      }

      if(accountInfo.status === 403){
        throw new Error("tai khoan cua chinh nguoi dung nay");
      }
      setForm(prev => ({ 
        ...prev, 
        toAccountName: accountInfo.data || accountInfo.fullName || 'Tên không có sẵn'
      }));
    
      setAccountVerified(true);
      setMessage({ 
        type: 'success', 
        text: 'Xác nhận tài khoản thành công!' 
      });
    } catch(e) {
      setForm(prev => ({ ...prev, toAccountName: '' }));
      setAccountVerified(false);
      
      // Kiểm tra status code để hiển thị thông báo phù hợp
    
        setMessage({ 
          type: 'error', 
          text: e.message 
        });
    } finally {
      setLoadingAccount(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.fromAccount || !form.amount) {
      setMessage({ type: 'error', text: 'Vui lòng chọn tài khoản nguồn và nhập số tiền' });
      return;
    }
    
    if (!form.toAccountNumber || !form.toAccountName) {
      setMessage({ type: 'error', text: 'Vui lòng nhập đầy đủ thông tin tài khoản đích' });
      return;
    }

    if (!accountVerified) {
      setMessage({ type: 'error', text: 'Vui lòng xác nhận tài khoản người nhận trước khi chuyển tiền' });
      return;
    }
    
    if (Number(form.amount) <= 0) {
      setMessage({ type: 'error', text: 'Số tiền phải lớn hơn 0' });
      return;
    }

    // Kiểm tra số dư
    const selectedAccount = accounts.find(acc => acc.accountType === form.fromAccount);
    if (selectedAccount && Number(form.amount) > selectedAccount.balance) {
      setMessage({ type: 'error', text: 'Số dư không đủ để thực hiện giao dịch' });
      return;
    }

    setSubmitting(true);
    try {
      const transferData = {
        fromAccountType: form.fromAccount,
        amount: Number(form.amount),
        description: form.description,
        toAcccountNumber: form.toAccountNumber
      };
      
      console.log('Transfer data:', transferData);
      await transferToExternal(transferData);
      
      setMessage({ type: 'success', text: 'Chuyển tiền thành công!' });
      setForm({ 
        fromAccount: '', 
        toAccountNumber: '', 
        toAccountName: '', 
        amount: '', 
        description: '',
        transferType: 'internal'
      });
      
      // Reload danh sách tài khoản
      await loadAccounts();
    } catch (e) {
      setMessage({ type: 'error', text: e.message || 'Chuyển tiền thất bại' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="transfer-loading"><div className="loading-spinner"></div></div>;
  }

  if (error) {
    return <div className="transfer-error">{error}</div>;
  }

  return (
    <div className="transfer-container">
      <div className="transfer-header">
        <h3>Chuyển tiền</h3>
        <p>Chuyển tiền đến tài khoản khác trong hệ thống</p>
      </div>

      {message && (
        <div className={`transfer-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="transfer-form">
        <div className="form-section">
          <h4>Thông tin tài khoản nguồn</h4>
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
        </div>

        <div className="form-section">
          <h4>Thông tin người nhận</h4>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Số tài khoản người nhận</label>
              <div className="account-verify-container">
                <div className="input-with-loading">
                  <input
                    type="text"
                    className="form-input"
                    value={form.toAccountNumber}
                    onChange={(e) => handleAccountNumberChange(e.target.value)}
                    placeholder="Nhập số tài khoản"
                    required
                  />
                  {loadingAccount && (
                    <div className="input-loading">
                      <div className="loading-spinner-small"></div>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="verify-btn"
                  onClick={handleVerifyAccount}
                  disabled={loadingAccount || !form.toAccountNumber}
                >
                  {loadingAccount ? 'Đang xác nhận...' : 'Xác nhận'}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Tên người nhận</label>
              <input
                type="text"
                className={`form-input ${accountVerified ? 'verified' : ''}`}
                value={form.toAccountName}
                onChange={(e) => handleChange('toAccountName', e.target.value)}
                placeholder={accountVerified ? "Tên đã được xác nhận" : "Nhấn 'Xác nhận' để hiển thị tên"}
                required
                readOnly={accountVerified}
              />
              {accountVerified && (
                <div className="verified-indicator">
                  <span className="verified-icon">✓</span>
                  <span className="verified-text">Đã xác nhận</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Thông tin giao dịch</h4>
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
              <label className="form-label">Nội dung chuyển tiền</label>
              <input
                type="text"
                className="form-input"
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Nội dung giao dịch"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="transfer-btn"
            disabled={submitting}
          >
            {submitting ? 'Đang xử lý...' : 'Chuyển tiền'}
          </button>
        </div>
      </form>

      <div className="transfer-info">
        <h4>Tài khoản của bạn</h4>
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