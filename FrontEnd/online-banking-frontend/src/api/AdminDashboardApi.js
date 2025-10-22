import apiClient from './ApiClient';


export const getAllBankAccount = async () => {
    try {
        const response = await apiClient.get(`/bank-accounts`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể xóa tài khoản');
      }
}


export const changeStatus = async (accountNumber,newStatus) => {
    try {
        const response = await apiClient.post(`admin/bank-account/change-status`,{accountNumber: accountNumber,newStatus: newStatus});
        return response;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể xóa tài khoản');
      }
}

export const deleteBankAccount = async (accountId) => {
    try {
        const response = await apiClient.delete(`admin/bank-account/${accountId}`);
        return response;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể xóa tài khoản');
      }
}

export const filterBankAccounts = async (filters, page, size, sort) => {
  try {
    const response = await apiClient.get(`/admin/bank-account`, {
      params: {
        ...filters, // { username, fullName, email, status }
        page,
        size,
        sort,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tải danh sách tài khoản');
  }
};


export const sendNotification = async (notificationData) => {
    try {
        const response = await apiClient.post(`admin/notifications`, notificationData);
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể gửi thông báo');
    }
};

export const depositBankAccount = async (depositData) => {
    try {
        const response = await apiClient.post(`admin/bank-account/deposit`, depositData);
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể gửi thông báo');
    }
};

export const addUserAccount = async (accountData) => {
    try {
        const response = await apiClient.post(`admin/user-account`, accountData);
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể gửi thông báo');
    }
};