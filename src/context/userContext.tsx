// src/context/userContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../models/user.model'; // Adjust the path as needed
import { useMutation } from '@tanstack/react-query';
import { updateUser } from '../services/apiService';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: async ({
      updatedUser,
      newUserName
    }: {
      updatedUser: User;
      newUserName : string | null;
    }) => {
      return await updateUser(updatedUser, newUserName);
    },
    // Optional: Define onSuccess, onError, etc.
    onSuccess: (data) => {
      // Handle success (e.g., show a notification, invalidate queries)
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
    },
  });
};