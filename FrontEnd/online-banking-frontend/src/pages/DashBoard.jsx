import React, {  useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Notifications from "../components/Dashboard/Notifications";
import Chart from "../components/Dashboard/Chart";
import "../assets/styles/Dashboard/Dashboard.css";
import { getUserInfo } from "../api/dashboardApi";
import AccountSummary from "../components/Dashboard/AccountSummary";
import TransactionHistory from "../components/Dashboard/TransactionHistory";
import QuickActions from "../components/Dashboard/QuickAction/QuickActions";
import { useState } from "react";
import Header from "../components/common/header";
import Footer from "../components/common/footer";

// Component Dashboard chính
const Dashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Kiểm tra token và lấy thông tin user
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  const GenerateUserInfo = () => {
     const [userInfo,setUserInfo] = useState(null);
     useEffect(() => {
      const fetchUserInfo = async () => {
        const userInfo = await getUserInfo();
        setUserInfo(userInfo);
      };
      fetchUserInfo();
     }, []);
     return userInfo;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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
            {/* Nội dung của từng thao tác sẽ hiển thị ngay bên dưới */}
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
      <Footer/>
    </div>
  );
};

export default Dashboard;
