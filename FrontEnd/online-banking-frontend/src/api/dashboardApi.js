import apiClient from './ApiClient';

/**
 * Lấy thông tin người dùng
 * @returns {Promise} - Promise chứa thông tin user
 */
export const getUserInfo = async () => {
  try {
    console.log(apiClient);
    const response = await apiClient.get('/user/profile');
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy thông tin người dùng');
  }
};



/**
 * Lấy danh sách tài khoản của người dùng
 * @returns {Promise} - Promise chứa danh sách tài khoản
 */
export const getUserAccounts = async () => {
  try {
    const response = await apiClient.get('/accounts');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy danh sách tài khoản');
  }
};

/**
 * Lấy lịch sử giao dịch
 * @param {Object} params - Tham số tìm kiếm
 * @param {number} params.page - Trang hiện tại
 * @param {number} params.limit - Số lượng giao dịch mỗi trang
 * @param {string} params.accountId - ID tài khoản (tùy chọn)
 * @param {string} params.fromDate - Từ ngày (tùy chọn)
 * @param {string} params.toDate - Đến ngày (tùy chọn)
 * @returns {Promise} - Promise chứa lịch sử giao dịch
 */
export const getTransactionHistory = async (params = {}) => {
  try {
    const response = await apiClient.get('/transactions', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy lịch sử giao dịch');
  }
};

/**
 * Lấy tổng quan tài chính
 * @returns {Promise} - Promise chứa tổng quan tài chính
 */
export const getFinancialOverview = async () => {
  try {
    const response = await apiClient.get('/dashboard/overview');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy tổng quan tài chính');
  }
};

/**
 * Chuyển tiền
 * @param {Object} transferData - Dữ liệu chuyển tiền
 * @param {string} transferData.toAccount - Tài khoản nhận
 * @param {number} transferData.amount - Số tiền
 * @param {string} transferData.description - Mô tả
 * @param {string} transferData.fromAccount - Tài khoản gửi (tùy chọn)
 * @returns {Promise} - Promise chứa kết quả chuyển tiền
 */
export const transferMoney = async (transferData) => {
  try {
    const response = await apiClient.post('/transactions/transfer', transferData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Chuyển tiền thất bại');
  }
};

/**
 * Nạp tiền vào tài khoản
 * @param {Object} depositData - Dữ liệu nạp tiền
 * @param {string} depositData.accountId - ID tài khoản
 * @param {number} depositData.amount - Số tiền
 * @param {string} depositData.method - Phương thức nạp tiền
 * @returns {Promise} - Promise chứa kết quả nạp tiền
 */
export const depositMoney = async (depositData) => {
  try {
    const response = await apiClient.post('/transactions/deposit', depositData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Nạp tiền thất bại');
  }
};

/**
 * Rút tiền từ tài khoản
 * @param {Object} withdrawData - Dữ liệu rút tiền
 * @param {string} withdrawData.accountId - ID tài khoản
 * @param {number} withdrawData.amount - Số tiền
 * @param {string} withdrawData.method - Phương thức rút tiền
 * @returns {Promise} - Promise chứa kết quả rút tiền
 */
export const withdrawMoney = async (withdrawData) => {
  try {
    const response = await apiClient.post('/transactions/withdraw', withdrawData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Rút tiền thất bại');
  }
};

/**
 * Thanh toán hóa đơn
 * @param {Object} paymentData - Dữ liệu thanh toán
 * @param {string} paymentData.billType - Loại hóa đơn
 * @param {string} paymentData.billNumber - Số hóa đơn
 * @param {number} paymentData.amount - Số tiền
 * @param {string} paymentData.accountId - ID tài khoản thanh toán
 * @returns {Promise} - Promise chứa kết quả thanh toán
 */
export const payBill = async (paymentData) => {
  try {
    const response = await apiClient.post('/transactions/payment', paymentData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Thanh toán thất bại');
  }
};

/**
 * Lấy thông tin tỷ giá ngoại tệ
 * @returns {Promise} - Promise chứa thông tin tỷ giá
 */
export const getExchangeRates = async () => {
  try {
    const response = await apiClient.get('/exchange-rates');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy thông tin tỷ giá');
  }
};

/**
 * Chuyển đổi ngoại tệ
 * @param {Object} conversionData - Dữ liệu chuyển đổi
 * @param {string} conversionData.fromCurrency - Từ loại tiền tệ
 * @param {string} conversionData.toCurrency - Sang loại tiền tệ
 * @param {number} conversionData.amount - Số tiền
 * @param {string} conversionData.accountId - ID tài khoản
 * @returns {Promise} - Promise chứa kết quả chuyển đổi
 */
export const convertCurrency = async (conversionData) => {
  try {
    const response = await apiClient.post('/transactions/convert', conversionData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Chuyển đổi ngoại tệ thất bại');
  }
};

/**
 * Lấy thông báo của người dùng
 * @param {Object} params - Tham số tìm kiếm
 * @param {number} params.page - Trang hiện tại
 * @param {number} params.limit - Số lượng thông báo mỗi trang
 * @param {boolean} params.unreadOnly - Chỉ lấy thông báo chưa đọc
 * @returns {Promise} - Promise chứa danh sách thông báo
 */
export const getNotifications = async (params = {}) => {
  try {
    const response = await apiClient.get('/notifications', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy thông báo');
  }
};

/**
 * Đánh dấu thông báo đã đọc
 * @param {string} notificationId - ID thông báo
 * @returns {Promise} - Promise chứa kết quả
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await apiClient.patch(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể đánh dấu thông báo đã đọc');
  }
};

/**
 * Lấy thống kê giao dịch theo thời gian
 * @param {Object} params - Tham số thống kê
 * @param {string} params.period - Khoảng thời gian (daily, weekly, monthly, yearly)
 * @param {string} params.fromDate - Từ ngày
 * @param {string} params.toDate - Đến ngày
 * @returns {Promise} - Promise chứa thống kê giao dịch
 */
export const getTransactionStats = async (params = {}) => {
  try {
    const response = await apiClient.get('/dashboard/stats', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy thống kê giao dịch');
  }
};


export default {
  getUserInfo,
  getUserAccounts,
  getTransactionHistory,
  getFinancialOverview,
  transferMoney,
  depositMoney,
  withdrawMoney,
  payBill,
  getExchangeRates,
  convertCurrency,
  getNotifications,
  markNotificationAsRead,
  getTransactionStats,
};
