import React, { useEffect, useState } from 'react';
import { getUserAccounts } from '../../api/DashBoard/QuickActionApi';
import '../../assets/styles/Dashboard/Dashboard.css';
// Component tóm tắt tài khoản
const AccountSummary = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadAccounts() {
      try {
        const list = await getUserAccounts();
        if (!isMounted) return;
        const normalized = (Array.isArray(list) ? list : (list?.data ?? [])).map((a, index) => ({
          id: a.id ?? index,
          name: a.accountType === 'CHECKING' ? 'Tài khoản chính' : 
          a.accountType === 'SAVINGS' ? 'Tài khoản tiết kiệm' : 
          a.accountType === 'USD' ? 'Tài khoản USD' : `Tài khoản ${a.accountType}`,          balance: Number(a.balance ?? 0),
          accountNumber: String(a.accountNumber || a.number || ''),
          type: a.accountType === 'USD' ? 'USD' : 'VND'
        }));
        setAccounts(normalized);
      } catch (e) {
        if (isMounted) setError(e.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadAccounts();
    // Listen for reload event
    const reload = () => { setLoading(true); setTimeout(loadAccounts, 150); };
    window.addEventListener('account-summary-reload', reload);
    return () => { isMounted = false; window.removeEventListener('account-summary-reload', reload); };
  }, []);

  if (loading) {
    return <div className="loading"><div className="loading-spinner"></div></div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  
    return (
      <div className="account-summary">
        <h3>Tài khoản của tôi</h3>
        <div className="accounts-grid">
          {accounts.map(account => (
            <div key={account.id} className="account-card">
              <div className="account-header">
                <h4>{account.name}</h4>
                <span className="account-type">{account.type}</span>
              </div>
              <div className="account-balance">
                {account.type === 'VND' ? 
                  `${account.balance.toLocaleString('vi-VN')} VND` : 
                  `$${account.balance.toLocaleString('en-US')}`
                }
              </div>
              <div className="account-number">
                ****{account.accountNumber.slice(-4)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default AccountSummary;