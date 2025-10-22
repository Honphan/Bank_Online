import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const roles = localStorage.getItem('roles');
  console.log("role: ",roles);
  console.log("allowedRoutes: " + allowedRoles);

  if(!allowedRoles){
    return <Navigate to="/login" replace />;
  }
  
  // Nếu chưa đăng nhập, chuyển về trang login
  if (!token) {
    return <Navigate to="/login" replace />;
  }


  // Nếu không có roles trong localStorage, về login để lấy lại role
  if (!roles) {
    localStorage.clear(); // Xóa token vì không có role
    return <Navigate to="/login" replace />;
  }

  // So sánh role của user với role được phép
  const hasPermission = allowedRoles.includes(roles);
  console.log(hasPermission)
  if (!hasPermission) {
    // Nếu role không phù hợp, về dashboard tương ứng với role hiện tại
    return <Navigate to="/login"/>
  }

  return children;
};

export default ProtectedRoute;