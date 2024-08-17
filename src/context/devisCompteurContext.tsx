// src/contexts/DevisCompteurContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000/');

interface DevisCompteurContextType {
  devisCompteur: number;
  setDevisCompteur: React.Dispatch<React.SetStateAction<number>>;
}

const DevisCompteurContext = createContext<DevisCompteurContextType | undefined>(undefined);

export const DevisCompteurProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devisCompteur, setDevisCompteur] = useState<number>(0);

  useEffect(() => {
    // Listen for updates from the socket
    socket.on('updateDevisCompteur', (newValue: number) => {
      setDevisCompteur(newValue);
    });

    return () => {
      // Cleanup listener on unmount
      socket.off('updateDevisCompteur');
    };
  }, []);

  return (
    <DevisCompteurContext.Provider value={{ devisCompteur, setDevisCompteur }}>
      {children}
    </DevisCompteurContext.Provider>
  );
};

export const useDevisCompteur = () => {
  const context = useContext(DevisCompteurContext);
  if (!context) {
    throw new Error('useDevisCompteur must be used within a DevisCompteurProvider');
  }
  return context;
};
