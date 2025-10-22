import React from 'react';
import { Link } from 'react-router-dom';

// Component các hành động nhanh
const QuickActions = () => {
    const actions = [
      { id: 1, name: 'Chuyển tiền', nameValue:'transfer', icon: '💸', color: '#3b82f6' },
      { id: 2, name: 'Nạp tiền',nameValue:'deposit', icon: '📱', color: '#10b981' },
      { id: 4, name: 'Rút tiền',nameValue:'withdraw', icon: '🏧', color: '#ef4444' },
      { id: 5, name: 'Chuyển đổi',nameValue:'exchange', icon: '🔄', color: '#8b5cf6' },
      { id: 6, name: 'Lịch sử',nameValue:'history', icon: '📊', color: '#06b6d4' },
      { id: 3, name: 'Thông tin cá nhân',nameValue:'profile', icon: '👤', color: '#0ea5e9' }
    ];
  
    return (
      <div className="quick-actions">
        <h3>Thao tác nhanh</h3>
        <div className="actions-grid">
          {actions.map(action => (
            <Link
              key={action.id}
              to={`/dashboard/${encodeURIComponent(action.nameValue)}`}
              className="action-btn"
              style={{ '--action-color': action.color }}
            >
              <div className="action-icon">{action.icon}</div>
              <span>{action.name}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  export default QuickActions;