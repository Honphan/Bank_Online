import { useState } from 'react';
import { sendNotification } from '../../api/AdminDashboardApi';

const NotificationForm = ({ loading, setLoading, setMessage }) => {
  // Form states
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    content: '',
    targetType: 'ALL',
    username: '',
    notificationType: 'INFO', // Thêm kiểu thông báo mặc định là INFO
  });

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Implement API call
      console.log('Notification Data:', notificationForm);
      const res = await sendNotification(notificationForm);
      console.log(res);
      console.log('Sending notification:', notificationForm);
      setMessage({ type: 'success', text: 'Gửi thông báo thành công!' });
      setNotificationForm({
        title: '',
        content: '',
        targetType: 'all',
        username: '',
        notificationType: 'INFO', // Reset kiểu thông báo về mặc định
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-section">
      <h3>Gửi thông báo</h3>
      <form onSubmit={handleSendNotification} className="admin-form">
        <div className="form-group">
          <label>Tiêu đề</label>
          <input
            type="text"
            value={notificationForm.title}
            onChange={(e) =>
              setNotificationForm({ ...notificationForm, title: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Nội dung</label>
          <textarea
            rows="4"
            value={notificationForm.content}
            onChange={(e) =>
              setNotificationForm({ ...notificationForm, content: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Kiểu thông báo</label>
          <select
            value={notificationForm.notificationType}
            onChange={(e) =>
              setNotificationForm({ ...notificationForm, notificationType: e.target.value })
            }
          >
            <option value="INFO">Thông tin (INFO)</option>
            <option value="WARNING">Cảnh báo (WARNING)</option>
            <option value="SUCCESS">Thành công (SUCCESS)</option>
          </select>
        </div>
        <div className="form-group">
          <label>Gửi đến</label>
          <select
            value={notificationForm.targetType}
            onChange={(e) =>
              setNotificationForm({ ...notificationForm, targetType: e.target.value })
            }
          >
            <option value="all">Tất cả tài khoản</option>
            <option value="specific">Tài khoản cụ thể</option>
          </select>
        </div>
        {notificationForm.targetType === 'specific' && (
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Nhập username"
              value={notificationForm.username}
              onChange={(e) =>
                setNotificationForm({ ...notificationForm, username: e.target.value })
              }
            />
          </div>
        )}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Đang gửi...' : 'Gửi thông báo'}
        </button>
      </form>
    </div>
  );
};

export default NotificationForm;
