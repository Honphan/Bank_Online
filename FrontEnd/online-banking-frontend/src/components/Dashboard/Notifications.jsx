import React, { useState } from 'react';
import '../../assets/styles/Dashboard/Notifications.css';

const Notifications = () => {
  const [notifications] = useState([
    {
      id: 1,
      title: 'Giao dịch thành công',
      message: 'Bạn đã chuyển 500,000 VND cho Nguyễn Văn A',
      time: '2 phút trước',
      type: 'success',
      read: false
    },
    {
      id: 2,
      title: 'Nhắc nhở thanh toán',
      message: 'Hóa đơn điện tháng 1/2024 sắp đến hạn thanh toán',
      time: '1 giờ trước',
      type: 'warning',
      read: false
    },
    {
      id: 3,
      title: 'Cập nhật bảo mật',
      message: 'Hệ thống đã được cập nhật với các tính năng bảo mật mới',
      time: '3 giờ trước',
      type: 'info',
      read: true
    },
    {
      id: 4,
      title: 'Khuyến mãi đặc biệt',
      message: 'Giảm 50% phí chuyển tiền trong tháng này',
      time: '1 ngày trước',
      type: 'promotion',
      read: true
    }
  ]);

  const [showAll, setShowAll] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'promotion': return '🎉';
      default: return '📢';
    }
  };

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 3);

  return (
    <div className="notifications">
      <div className="notifications-header">
        <h3>Thông báo</h3>
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount}</span>
        )}
        {notifications.length > 3 && (
          <button 
            className="toggle-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Thu gọn' : 'Xem tất cả'}
          </button>
        )}
      </div>
      
      <div className="notifications-list">
        {displayedNotifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification-item ${!notification.read ? 'unread' : ''}`}
          >
            <div className="notification-icon">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="notification-content">
              <div className="notification-title">{notification.title}</div>
              <div className="notification-message">{notification.message}</div>
              <div className="notification-time">{notification.time}</div>
            </div>
            {!notification.read && <div className="unread-dot"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
