import { useState, useEffect } from 'react';
import { saveToken, getToken, removeToken, loginUser, fetchUserData } from '../services/authService';
import { useUser } from '../context/userContext';

const useAuth = () => {
  const { user, setUser } = useUser();
  const [error, setError] = useState<string | null>(null);

  const checkAuth = async () => {
    const token = getToken();
    if (token) {
      try {
        const userData = await fetchUserData(); //Problem here
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth(); // Check authentication on mount
  }, []);

  const handleLogin = async (username: string, password: string, navigate: (path: string) => void) => {
    try {
      const token = await loginUser(username, password);
      saveToken(token.accessToken);
      const userData = await fetchUserData();
      console.log(userData)
      setUser(userData);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleLogout = (navigate: (path: string) => void) => {
    removeToken();
    setUser(null);
    navigate('/login');
  };

  return { user, handleLogin, handleLogout, checkAuth, error };
};

export default useAuth;
