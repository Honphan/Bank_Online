import React from 'react';
import { useState } from 'react';
import { depositBankAccount } from '../../api/AdminDashboardApi';

const DepositForm = ({accounts, loading,setLoading,setMessage }) => {
    const [depositForm, setDepositForm] = useState({
      accountId: '',
      amount: '',
      description: ''
    });


    const handleDeposit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Implement API call
      const res = await depositBankAccount(depositForm);
      console.log(res);
      console.log('Depositing:', depositForm);
      setMessage({ type: 'success', text: 'Nạp tiền thành công!' });
      setDepositForm({ accountId: '', amount: '', description: '' });
    } catch {
      setMessage({ type: 'error', text: 'Nạp tiền thất bại' });
    } finally {
      setLoading(false);
    }
  };


  return (
  <div className="admin-section">
    <h3>Nạp tiền cho tài khoản</h3>
    <form onSubmit={handleDeposit} className="admin-form">
      <div className="form-group">
        <label>Chọn tài khoản</label>
        <select value={depositForm.accountId} onChange={e => setDepositForm({...depositForm, accountId: e.target.value})} required>
          <option value="">-- Chọn tài khoản --</option>
          {accounts.map((account,index) => (
            <option key={index} value={account.accountId}>
              {account.username} - {account.fullName} ({account.accountType !== 'USD'
                    ? `${account.balance}đ`
                    : `${account.balance}$`})
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Số tiền</label>
        <input type="number" min="1000" value={depositForm.amount}
          onChange={e => setDepositForm({...depositForm, amount: e.target.value})}
          placeholder="Nhập số tiền" required />
      </div>
      <div className="form-group">
        <label>Mô tả</label>
        <input type="text" value={depositForm.description}
          onChange={e => setDepositForm({...depositForm, description: e.target.value})}
          placeholder="Lý do nạp tiền" />
      </div>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Đang nạp...' : 'Nạp tiền'}
      </button>
    </form>
  </div>
);
};
export default DepositForm;
