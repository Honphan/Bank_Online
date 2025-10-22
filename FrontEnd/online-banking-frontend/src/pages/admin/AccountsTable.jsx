import React, { useState, useEffect, useCallback } from 'react';
import { filterBankAccounts } from '../../api/AdminDashboardApi';
import '../../assets/styles/Dashboard/admin/AccountsTable.css';

const AccountsTable = ({ handleToggleStatus, handleDeleteAccount, reloadTrigger }) => {
  const [accounts, setAccounts] = useState([]);
  const [filters, setFilters] = useState({ username: '', fullName: '', email: '', status: '' });
  const [filterField, setFilterField] = useState('username');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;

  const fetchAccounts = useCallback(async () => {
    try {
      const response = await filterBankAccounts(filters, currentPage, itemsPerPage, 'username,asc');
      setAccounts(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error(error.message);
    }
  }, [filters, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts, reloadTrigger]); // Added reloadTrigger to dependencies

  const handleSearch = () => {
    setFilters({ ...filters, [filterField]: searchTerm });
    setCurrentPage(0);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h3>Quản lý tài khoản</h3>
        <div className="search-container enhanced-search">
          <select
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
            className="filter-select enhanced-select"
          >
            <option value="username">Username</option>
            <option value="fullName">Full Name</option>
            <option value="email">Email</option>
            {/* <option value="status">Status</option> */}
          </select>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input enhanced-input"
          />
          <button onClick={handleSearch} className="btn-search enhanced-button">
            Tìm kiếm
          </button>
        </div>
      </div>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Username</th>
              <th>Email</th>
              <th>Họ tên</th>
              <th>Số dư</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => (
              <tr key={index}>
                <td>{index + 1 + currentPage * itemsPerPage}</td>
                <td>{account.username}</td>
                <td>{account.email || 'Chưa có email'}</td>
                <td>{account.fullName}</td>
                <td>
                  {account.accountType !== 'USD'
                    ? `${account.balance}₫`
                    : `${account.balance}$`}
                </td>
                <td>
                  <span className={`status-badge ${account.status.toLowerCase()}`}>
                    {{
                      ACTIVE: 'Hoạt động',
                      LOCKED: 'Bị khóa',
                      INACTIVE: 'Không hoạt động',
                    }[account.status] || 'Không xác định'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-sm btn-warning"
                      onClick={() => handleToggleStatus(account.accountNumber, account.status)}
                    >
                      {account.status === 'ACTIVE' ? 'Khóa' : 'Mở khóa'}
                    </button>
                    <button
                      className="btn-sm btn-danger"
                      onClick={() => handleDeleteAccount(account.accountId)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination-container enhanced-pagination">
        <button
          className="pagination-btn enhanced-pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Trước
        </button>
        <span className="pagination-info">
          Trang {currentPage + 1} / {totalPages}
        </span>
        <button
          className="pagination-btn enhanced-pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage + 1 === totalPages}
        >
          Tiếp
        </button>
      </div>
    </div>
  );
};

export default AccountsTable;
