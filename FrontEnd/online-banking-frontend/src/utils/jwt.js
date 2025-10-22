// src/utils/jwt.js
export const isTokenExpired = (jwt) => {
    if (!jwt || jwt.split('.').length !== 3) return true;
    try {
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      if (!payload?.exp) return true;
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  };