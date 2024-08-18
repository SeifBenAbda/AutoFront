// src/contexts/DevisCompteurContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DevisCompteur } from '../models/devis-compteur.model'; // Adjust the path as needed

interface DevisCompteurContextType {
    devisCompteur: DevisCompteur;
    setDevisCompteur: React.Dispatch<React.SetStateAction<DevisCompteur>>;
}

const DevisCompteurContext = createContext<DevisCompteurContextType | undefined>(undefined);

export const DevisCompteurProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [devisCompteur, setDevisCompteur] = useState<DevisCompteur>({ devisNumber: '0' });

    return (
        <DevisCompteurContext.Provider value={{ devisCompteur, setDevisCompteur }}>
            {children}
        </DevisCompteurContext.Provider>
    );
};

export const useDevisCompteur = (): DevisCompteurContextType => {
    const context = useContext(DevisCompteurContext);
    if (context === undefined) {
        throw new Error('useDevisCompteur must be used within a DevisCompteurProvider');
    }
    return context;
};
