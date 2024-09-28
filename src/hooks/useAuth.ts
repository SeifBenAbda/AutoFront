import { useState, useEffect } from 'react';
import { saveToken, getToken, removeToken, loginUser, fetchUserData } from '../services/authService';
import { useUser } from '../context/userContext';
import { User } from '../models/user.model'; // Adjust the path as needed


//const socket = io('http://localhost:3000/');

const useAuth = () => {
  const { user, setUser } = useUser();
  const [error, setError] = useState<string | null>(null);

  const checkAuth = async () => {
    const token = getToken();
    if (token) {
      try {
        const userData: User = await fetchUserData();
        if (userData) {
          setUser(userData);
        } else {
          removeToken();
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        removeToken();
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  /*useEffect(() => {
    socket.on('userUpdate', (updatedUserData: User) => {
      setUser(prevUser => ({
        ...(prevUser || {}), // Use an empty object if prevUser is null or undefined
        ...updatedUserData,
      }));
    });

    return () => {
      socket.off('userUpdate');
    };
  }, []);*/

  const handleLogin = async (username: string, password: string, navigate: (path: string) => void) => {
    try {
      const token = await loginUser(username, password);
      saveToken(token.accessToken);
      const userData: User = await fetchUserData();
      setUser(userData);
      //navigate('/dashboard');
      navigate('/car-request')
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