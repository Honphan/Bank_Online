import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/Dashboard/admin/AdminDashboard.css';
import AccountsTable from './AccountsTable';
import AddAccountForm from './AddAccountForm';
import NotificationForm from './NotificationForm';
import DepositForm from './DepositForm';
import { getAllBankAccount } from '../../api/AdminDashboardApi';
import { changeStatus, deleteBankAccount } from '../../api/AdminDashboardApi';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('accounts');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [reloadAccounts, setReloadAccounts] = useState(false); // State to trigger reload
  const [accounts , setAccounts] = useState([]);




  useEffect(() => {
    loadAccounts();
  }, [loading]);

  const loadAccounts = async () => {
    try {
      const res = await getAllBankAccount();
      setAccounts(res);
    } catch (error) {
      console.error('Failed to load accounts:', error);
    }
  };



  const handleDeleteAccount = async (accountId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) return;
    setLoading(true);
    try {
      // TODO: Implement API call
      console.log('Deleting account:', accountId);
      const res = await deleteBankAccount(accountId);
      console.log(res);
      setReloadAccounts((prev) => !prev); // Trigger reload
      setMessage({ type: 'success', text: 'Xóa tài khoản thành công!' });
    } catch {
      setMessage({ type: 'error', text: 'Xóa tài khoản thất bại' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (accountNumber, currentStatus) => {
    setLoading(true);
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      console.log('Toggling status:', accountNumber, newStatus);
      const res = await changeStatus(accountNumber, newStatus);
      console.log(res);
      setMessage({ type: 'success', text: 'Cập nhật trạng thái thành công!' });
      setReloadAccounts((prev) => !prev); // Trigger reload
    } catch {
      setMessage({ type: 'error', text: 'Cập nhật trạng thái thất bại' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <h1>🏦 Admin Dashboard</h1>
          <div className="header-actions">
            <button 
              className="logout-btn"
              onClick={() => {
                if (window.confirm('Bạn chắc chắn muốn đăng xuất?')) {
                  localStorage.clear();
                  navigate('/login');
                }
              }}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>
      <nav className="admin-nav">
        <button className={`nav-btn ${activeTab === 'accounts' ? 'active' : ''}`} onClick={() => setActiveTab('accounts')}>
          📊 Tài khoản
        </button>
        <button className={`nav-btn ${activeTab === 'notification' ? 'active' : ''}`} onClick={() => setActiveTab('notification')}>
          📢 Thông báo
        </button>
        <button className={`nav-btn ${activeTab === 'deposit' ? 'active' : ''}`} onClick={() => setActiveTab('deposit')}>
          💰 Nạp tiền
        </button>
        <button className={`nav-btn ${activeTab === 'add-account' ? 'active' : ''}`} onClick={() => setActiveTab('add-account')}>
          ➕ Thêm tài khoản
        </button>
      </nav>
      <main className="admin-main">
        {message && (
          <div className={`message ${message.type === 'success' ? 'success-message' : 'error-message'}`}>
            {message.text}
          </div>
        )}
        {activeTab === 'accounts' && (
          <AccountsTable
            handleToggleStatus={handleToggleStatus}
            handleDeleteAccount={handleDeleteAccount}
            reloadTrigger={reloadAccounts} // Pass reload trigger to AccountsTable
          />
        )}
        {activeTab === 'add-account' && (
          <AddAccountForm
            setLoading={setLoading}
            setMessage={setMessage}
            loading={loading}
            goBack={() => setActiveTab('accounts')}
          />
        )}
        {activeTab === 'deposit' && (
          <DepositForm
            setLoading={setLoading}
            setMessage={setMessage}
            loading={loading}
            accounts={accounts}
          />
        )}
        {activeTab === 'notification' && (
          <NotificationForm
            setLoading={setLoading}
            setMessage={setMessage}
            loading={loading}
          />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
