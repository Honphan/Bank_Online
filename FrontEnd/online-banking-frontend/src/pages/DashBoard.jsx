import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Notifications from "../components/Dashboard/Notifications";
import Chart from "../components/Dashboard/Chart";
import "../assets/styles/Dashboard/Dashboard.css";
import { getUserInfo } from "../api/dashboardApi";
import AccountSummary from "../components/Dashboard/AccountSummary";
import TransactionHistory from "../components/Dashboard/TransactionHistory";
import QuickActions from "../components/Dashboard/QuickAction/QuickActions";
import Header from "../components/common/header";
import Footer from "../components/common/footer";


const Dashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDashboard = async () => {
      // Kiểm tra token
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      // Lấy thông tin user
      try {
        const info = await getUserInfo();
        console.log('User info loaded:', info);
        setUserInfo(info);
      } catch (error) {
        console.error("Error fetching user info:", error);
        // Nếu token hết hạn hoặc không hợp lệ
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [navigate]);

  const GenerateUserInfo = () => {
    const [localUserInfo, setLocalUserInfo] = useState(null);
    
    useEffect(() => {
      const fetchInfo = async () => {
        try {
          const info = await getUserInfo();
          setLocalUserInfo(info);
        } catch (error) {
          console.error("Error in GenerateUserInfo:", error);
        }
      };
      fetchInfo();
    }, []);
    
    return localUserInfo;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Hiển thị loading khi đang fetch data
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Đang tải...</p>
      </div>
    );
  }

  // Lấy userId từ userInfo (thử nhiều trường có thể)
  const userId = userInfo?.id || 
                 userInfo?.userId || 
                 userInfo?.username || 
                 userInfo?.email ||
                 userInfo?.accountNumber;

  const userName = userInfo?.fullName || 
                   userInfo?.name || 
                   userInfo?.username || 
                   'User';

  console.log('Dashboard userId:', userId, 'userName:', userName);

  return (
    <div className="dashboard">
      {/* Header */}
      <Header GenerateUserInfo={GenerateUserInfo} handleLogout={handleLogout} />

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Account Summary */}
          <section className="dashboard-section">
            <AccountSummary />
          </section>

          {/* Quick Actions */}
          <section className="dashboard-section">
            <QuickActions />
            <div style={{ marginTop: '16px' }}>
              <Outlet />
            </div>
          </section>

          {/* Chart */}
          <section className="dashboard-section">
            <Chart />
          </section>

          {/* Notifications */}
          <section className="dashboard-section">
            <Notifications />
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Chat Component - Fixed position */}
      {userId && (
        <UserChat 
          userId={userId} 
          userName={userName}
        />
      )}
    </div>
  );
};

export default Dashboard;