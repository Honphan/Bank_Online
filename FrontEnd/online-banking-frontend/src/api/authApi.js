import apiClient from './ApiClient';

/**
 * Hàm đăng ký tài khoản người dùng
 * @param {Object} userData - Thông tin đăng ký
 * @param {string} userData.fullname - Họ và tên người dùng
 * @param {string} userData.username - username
 * @param {string} userData.email - Địa chỉ email
 * @param {string} userData.phone - Số điện thoại
 * @param {string} userData.password - Mật khẩu
 * @returns {Promise} - Promise chứa kết quả đăng ký
 */
export const register = async (userData) => {
  try {
    console.log(userData);
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    // Xử lý lỗi từ API
    if (error.response) {
      // Lỗi từ server với status code
      throw new Error(error.response.data.message || 'Đăng ký thất bại');
    } else if (error.request) {
      // Không nhận được phản hồi từ server
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    } else {
      // Lỗi khi thiết lập request
      throw new Error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  }
};

/**
 * Hàm đăng ký với các provider xã hội (Google, Facebook)
 * @param {string} provider - Nhà cung cấp xã hội ('google' hoặc 'facebook')
 * @param {Object} authData - Dữ liệu xác thực từ provider
 * @returns {Promise} - Promise chứa kết quả đăng ký
 */
export const socialRegister = async (provider, authData) => {
  try {
    const response = await apiClient.post(`/auth/${provider}/register`, authData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || `Đăng ký với ${provider} thất bại`);
    } else if (error.request) {
      throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
    } else {
      throw new Error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  }
};

/**
 * Hàm kiểm tra email đã tồn tại hay chưa
 * @param {string} email - Email cần kiểm tra
 * @returns {Promise<boolean>} - Promise chứa kết quả kiểm tra
 */
export const checkEmailExists = async (email) => {
  try {
    const response = await apiClient.get(`/auth/check-email?email=${email}`);
    return response.data.exists;
  } catch (error) {
    console.error('Lỗi kiểm tra email:', error);
    throw new Error('Không thể kiểm tra email. Vui lòng thử lại sau.');
  }
};

/**
 * Hàm đăng nhập
 * @param {Object} credentials - Thông tin đăng nhập
 * @param {string} credentials.username - Tên đăng nhập
 * @param {string} credentials.password - Mật khẩu
 * @returns {Promise} - Kết quả đăng nhập
 */
export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
  }
};

export default {
  register,
  socialRegister,
  checkEmailExists,
  login
};