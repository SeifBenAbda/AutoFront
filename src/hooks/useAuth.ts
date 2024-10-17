import {jwtDecode} from 'jwt-decode';
import { useState } from 'react';
import { saveToken, getToken, removeToken, loginUser, fetchUserData } from '../services/authService';
import { useUser } from '../context/userContext';
import { User } from '../models/user.model'; // Adjust the path as needed

interface DecodedToken {
  exp: number; // This is the expiration time in seconds
}

const useAuth = () => {
  const { user, setUser } = useUser();
  const [error, setError] = useState<string | null>(null);

  // Check if the token is expired
  const isTokenExpired = (token: string) => {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.exp * 1000 < Date.now(); // Convert exp from seconds to milliseconds and compare
  };

  const checkAuth = async () => {
    const token = getToken();
    if (token && !isTokenExpired(token)) {
      try {
        const userData: User = await fetchUserData(); // Get user data with valid token
        if (userData) {
          setUser(userData);
        } else {
          removeToken(); // Token is invalid
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        removeToken();
        setUser(null);
      }
    } else {
      removeToken(); // Token is expired or doesn't exist
      setUser(null);
    }
  };

  const handleLogin = async (username: string, password: string, navigate: (path: string) => void) => {
    try {
      const token = await loginUser(username, password);
      saveToken(token.accessToken);
      const userData: User = await fetchUserData();
      setUser(userData);
      navigate('/car-request');
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
