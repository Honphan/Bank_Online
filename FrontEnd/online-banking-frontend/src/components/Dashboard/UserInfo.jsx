import React from 'react';


// Component thông tin người dùng
const UserInfo = ({ userInfo, onLogout }) => {
    // console.log("userInfo", userInfo);
    return (
      <div className="user-info">
        <div className="user-avatar">
          <div className="avatar-circle">
            {userInfo?.data?.fullName?.charAt(0) || 'U'}
          </div>
        </div>
        <div className="user-details">
          <h4>Xin chào, {userInfo?.data?.fullName || 'Người dùng'}!</h4>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Đăng xuất
        </button>
      </div>
    );
  };

  export default UserInfo;