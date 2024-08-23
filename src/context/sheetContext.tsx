// src/contexts/SheetContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SheetContextType {
  numero: string | null;
  isOpen: boolean;
  openSheet: (numero: string) => void;
  closeSheet: () => void;
}

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export const SheetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [numero, setNumero] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openSheet = (numero: string) => {
    setNumero(numero);
    setIsOpen(true);
  };

  const closeSheet = () => {
    setNumero(null);
    setIsOpen(false);
  };

  return (
    <SheetContext.Provider value={{ numero, isOpen, openSheet, closeSheet }}>
      {children}
    </SheetContext.Provider>
  );
};

export const useSheet = () => {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error('useSheet must be used within a SheetProvider');
  }
  return context;
};
