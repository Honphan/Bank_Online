import { useNavigate } from 'react-router-dom';

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '50px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '72px', margin: '0', color: '#dc3545' }}>403</h1>
      <h2 style={{ fontSize: '32px', margin: '20px 0' }}>Truy cập bị từ chối</h2>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
        Bạn không có quyền truy cập vào trang này
      </p>
      <button 
        onClick={() => {
          const role = localStorage.getItem('roles');
          if (role === 'ROLE_ADMIN') {
            navigate('/admin/dashboard', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        }} 
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
      >
        Quay lại
      </button>
    
    </div>
  );
};

export default Forbidden;