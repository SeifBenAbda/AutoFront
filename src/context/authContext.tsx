import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { saveToken, getToken, removeToken, loginUser } from '../services/authService'; // Import loginUser
import { fetchUserData } from '../services/apiService';
import { User } from '../models/user.model';


interface AuthContextProps {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchUserData()
        .then(data => setUser(data))
        .catch(err => {
          removeToken(); // Clear token on error
        });
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const token = await loginUser(username, password);
      saveToken(token.accessToken); // Save token received from loginUser
      const userData = await fetchUserData(); // Fetch user data
      setUser(userData);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError('Échec de la connexion. Vos identifiants sont incorrects ou votre compte est inactif.');
      throw err; // Rethrow the error to be handled in the component
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

