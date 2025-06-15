import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { saveToken, getToken, removeToken, loginUser, fetchUserData, logoutUser } from '../services/authService';
import { useUser } from '../context/userContext';
import { User } from '../models/user.model';
import { getDatabasesAccess } from '../services/apiService';
import { getDatabaseName, removeDatabaseName, saveDatabaseName, state } from '../utils/shared_functions';

interface DecodedToken {
  exp: number;
}

const useAuth = () => {
  const { user, setUser } = useUser();
  const [error, setError] = useState<string | null>(null);

  // Check if the token is expired
  const isTokenExpired = (token: string) => {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  };

  const checkAuth = async () => {
    const token = getToken();
    if (token && !isTokenExpired(token)) {
      try {
        const userData: User = await fetchUserData();
        if (userData) {
            const databases = await getDatabasesAccess(userData.username); 
            state.databasesAccess = databases;
            const databaseName = getDatabaseName();
            if(databaseName=== '') {
               state.databaseName = databases[0] || ''; 
               saveDatabaseName(state.databaseName);
            }
          setUser(userData);
        } else {
          removeToken();
          //setUser(null);
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        removeToken();
        removeDatabaseName();
        //setUser(null);
      }
    } else {
      removeToken();
      //removeDatabaseName();
      //setUser(null);
    }
  };

  const handleLogin = async (username: string, password: string, navigate: (path: string) => void) => {
    try {
      const { accessToken, expiresAt } = await loginUser(username, password);
      saveToken(accessToken, expiresAt);
      const userData: User = await fetchUserData();
      if (userData) {
        const databases = await getDatabasesAccess(userData.username);
        state.databasesAccess = databases;
        state.databaseName = getDatabaseName();
        if(state.databaseName === '') {
          state.databaseName = databases[0] || '';
          saveDatabaseName(state.databaseName);
        }
        setUser(userData);
        navigate('/dashboard');
      }
      else {
        removeToken();
        removeDatabaseName();
        setUser(null);
        setError('Échec de la récupération des données utilisateur après la connexion');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleLogout = async (username:string, navigate: (path: string) => void) => {
    await logoutUser(username);
    removeToken();
    removeDatabaseName();
    setUser(null);
    navigate('/login');
  };

  return { user, handleLogin, handleLogout, checkAuth, error };
};

export default useAuth;