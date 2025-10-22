import apiClient from './ApiClient';

// Admin API functions

/**
 * Lấy danh sách tất cả tài khoản
 */
export const getAllAccounts = async (params = {}) => {
  try {
    const response = await apiClient.get('/admin/accounts', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tải danh sách tài khoản');
  }
};

/**
 * Thêm tài khoản mới
 */
export const createAccount = async (accountData) => {
  try {
    const response = await apiClient.post('/admin/accounts', accountData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tạo tài khoản mới');
  }
};

/**
 * Xóa tài khoản
 */
export const deleteAccount = async (accountId) => {
  try {
    const response = await apiClient.delete(`/admin/accounts/${accountId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể xóa tài khoản');
  }
};

/**
 * Cập nhật trạng thái tài khoản
 */
export const updateAccountStatus = async (accountId, status) => {
  try {
    const response = await apiClient.patch(`/admin/accounts/${accountId}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể cập nhật trạng thái tài khoản');
  }
};

/**
 * Nạp tiền cho tài khoản
 */
export const depositToAccount = async (accountId, amount, description = '') => {
  try {
    const response = await apiClient.post(`/admin/accounts/${accountId}/deposit`, {
      amount,
      description
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể nạp tiền');
  }
};

/**
 * Gửi thông báo
 */
export const sendNotification = async (notificationData) => {
  try {
    const response = await apiClient.post('/admin/notifications', notificationData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể gửi thông báo');
  }
};

/**
 * Lấy thống kê tổng quan
 */
export const getAdminStats = async () => {
  try {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tải thống kê');
  }
};

/**
 * Lấy lịch sử giao dịch của tất cả tài khoản
 */
export const getAllTransactions = async (params = {}) => {
  try {
    const response = await apiClient.get('/admin/transactions', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tải lịch sử giao dịch');
  }
};

/**
 * Khóa/Mở khóa tài khoản
 */
export const toggleAccountLock = async (accountId) => {
  try {
    const response = await apiClient.patch(`/admin/accounts/${accountId}/toggle-lock`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể thay đổi trạng thái khóa tài khoản');
  }
};

/**
 * Lấy thông tin chi tiết tài khoản
 */
export const getAccountDetails = async (accountId) => {
  try {
    const response = await apiClient.get(`/admin/accounts/${accountId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tải thông tin tài khoản');
  }
};

/**
 * Cập nhật thông tin tài khoản
 */
export const updateAccountInfo = async (accountId, accountData) => {
  try {
    const response = await apiClient.put(`/admin/accounts/${accountId}`, accountData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể cập nhật thông tin tài khoản');
  }
};

/**
 * Lấy danh sách thông báo đã gửi
 */
export const getNotificationHistory = async (params = {}) => {
  try {
    const response = await apiClient.get('/admin/notifications/history', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tải lịch sử thông báo');
  }
};
