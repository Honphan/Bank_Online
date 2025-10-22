import apiClient from "../ApiClient"


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
  
  // Cập nhật thông tin người dùng (chỉ truyền field đã đổi)
  export const updateUserProfile = async (payload) => {
    try {
      const res = await apiClient.patch('/user/profile', payload);
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Cập nhật thông tin thất bại');
    }
  };
  
  // Đổi mật khẩu
  export const changePassword = async ({ currentPassword, newPassword }) => {
    try {
      const res = await apiClient.post('/user/change-password', { currentPassword, newPassword });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    }
  };

  export const getUserAccounts = async () => {
    try {
      const res = await apiClient.get('/user/bank-accounts');
      console.log(res.data);
      return res.data; // mong đợi mảng tài khoản
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách tài khoản');
    }
  };


export const exchangeMoney = async (payload) => {
  try {
    console.log(payload);
    const res = await apiClient.post('/user/exchange', payload);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Chuyển tiền thất bại');
  }
};

export const transferToExternal = async (transferData) => {
  try {
    console.log(transferData);
    const res = await apiClient.post('/bank-account/transfer', transferData);
    if(res.status == 200){
      throw new Error("loi khi chuyen khoan");
    }
    console.log(res);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Chuyển tiền thất bại');
  }
};

export const getAccountByNumber = async (data) => {
  try {
    console.log(data)
    const response = await apiClient.post(`/bank-account`,data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không tìm thấy tài khoản');
  }
};

export const depositPhone = async (data) => {
  try {
    console.log(data);
    const response = await apiClient.post(`/bank-account/deposit-phone`,data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không tìm thấy tài khoản');
  }
}

  export default { 
    getUserInfo,
     updateUserProfile, 
     changePassword,
      getUserAccounts,
      exchangeMoney
 };