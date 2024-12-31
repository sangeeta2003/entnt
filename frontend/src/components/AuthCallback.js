import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (token) {
        try {
          await loginWithToken(token);
          navigate('/admin/dashboard');
        } catch (error) {
          navigate('/login', { 
            state: { error: 'Authentication failed. Please try again.' } 
          });
        }
      } else {
        navigate('/login');
      }
    };

    handleCallback();
  }, [location, navigate, loginWithToken]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default AuthCallback; 