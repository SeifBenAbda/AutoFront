// src/hooks/useDevisCompteur.ts
import { useEffect } from 'react';
import { useDevisCompteur } from '../context/devisCompteurContext';
import io from 'socket.io-client';

const socket = io('http://localhost:3000/'); // Initialize WebSocket connection

const useDevisCompteurFetcher = () => {
    const { devisCompteur, setDevisCompteur } = useDevisCompteur();

    useEffect(() => {
        const fetchDevisCompteur = async () => {
            console.log("fetching devis number")
            const token = localStorage.getItem('authToken'); // Assuming the token is stored in localStorage
            try {
                const response = await fetch('http://localhost:3000/devis-compteur', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    setDevisCompteur({ devisNumber: data[0]["compteur"] });
                } else {
                    console.error('Failed to fetch counter value');
                }
            } catch (error) {
                console.error('Error fetching counter value:', error);
            }
        };

        fetchDevisCompteur();

        socket.on('updateDevisCompteur', (newValue: string) => {
            setDevisCompteur({ devisNumber: newValue });
        });

        return () => {
            socket.off('updateDevisCompteur');
        };
    }, [setDevisCompteur]);
};

export default useDevisCompteurFetcher;
