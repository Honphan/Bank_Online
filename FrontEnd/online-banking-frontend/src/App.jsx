// src/App.jsx
import RegisterPage from './pages/RegisterPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import Dashboard from './pages/DashBoard.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import Forbidden from './pages/Forbidden.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import TransferPage from './components/Dashboard/QuickAction/TransferPage.jsx'
import DepositPage from './components/Dashboard/QuickAction/DepositPage.jsx'
import WithdrawPage from './components/Dashboard/QuickAction/WithdrawPage.jsx'
import ExchangePage from './components/Dashboard/QuickAction/ExchangePage.jsx'
import HistoryPage from './components/Dashboard/QuickAction/HistoryPage.jsx'
import ProfilePage from './components/Dashboard/QuickAction/ProfilePage.jsx'
import ChatWithAdmin from './components/Dashboard/QuickAction/MessageWithAdmin.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/Forbidden" element={<Forbidden />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ROLE_USER']}>
              <Dashboard replace />
            </ProtectedRoute>
          }
        >
          <Route path="transfer" element={<TransferPage />} />
          <Route path="deposit" element={<DepositPage />} />
          <Route path="withdraw" element={<WithdrawPage />} />
          <Route path="exchange" element={<ExchangePage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="chat-with-admin" element={<ChatWithAdmin />} />
        </Route>
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminDashboard replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <Navigate to="/dashboard" replace />
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App