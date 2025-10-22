import React, { useState } from 'react';


// Component lịch sử giao dịch
const TransactionHistory = () => {
    const [transactions] = useState([
      { id: 1, type: 'transfer', amount: -500000, description: 'Chuyển tiền cho Nguyễn Văn A', date: '2024-01-15', status: 'completed' },
      { id: 2, type: 'deposit', amount: 2000000, description: 'Nhận lương tháng 1', date: '2024-01-10', status: 'completed' },
      { id: 3, type: 'payment', amount: -150000, description: 'Thanh toán hóa đơn điện', date: '2024-01-08', status: 'completed' },
      { id: 4, type: 'withdraw', amount: -1000000, description: 'Rút tiền ATM', date: '2024-01-05', status: 'completed' },
      { id: 5, type: 'transfer', amount: 3000000, description: 'Nhận tiền từ Trần Thị B', date: '2024-01-03', status: 'completed' }
    ]);
  
    const getTransactionIcon = (type) => {
      switch (type) {
        case 'transfer': return '↔️';
        case 'deposit': return '📥';
        case 'withdraw': return '📤';
        case 'payment': return '💳';
        default: return '💰';
      }
    };
  
    const getAmountColor = (amount) => {
      return amount > 0 ? 'positive' : 'negative';
    };
  
    return (
      <div className="transaction-history">
        <div className="section-header">
          <h3>Lịch sử giao dịch</h3>
          <button className="view-all-btn">Xem tất cả</button>
        </div>
        <div className="transactions-list">
          {transactions.map(transaction => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-icon">
                {getTransactionIcon(transaction.type)}
              </div>
              <div className="transaction-details">
                <div className="transaction-description">{transaction.description}</div>
                <div className="transaction-date">{transaction.date}</div>
              </div>
              <div className={`transaction-amount ${getAmountColor(transaction.amount)}`}>
                {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('vi-VN')} VND
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default TransactionHistory;