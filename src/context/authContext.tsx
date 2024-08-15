// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { saveToken, getToken, removeToken } from '../services/authService';
import { fetchUserData } from '../services/apiService';
import { User } from '../models/user.model';



interface AuthContextProps {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchUserData()
        .then(data => setUser(data))
        .catch(err => console.error(err));
    }
  }, []);

  const login = (token: string) => {
    saveToken(token);
    fetchUserData()
      .then(data => setUser(data))
      .catch(err => console.error(err));
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
