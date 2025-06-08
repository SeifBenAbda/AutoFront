import { getToken } from "./authService";



const API_URL = import.meta.env.VITE_API_URL;

export const fetchAgentsHistory = async (
    database: string,
    navigate: (path: string) => void,
    options?: {
        username?: string;
        entityType?: string;
        fromDate?: Date;
        toDate?: Date;
        page?: number;
    },
    
) => {
    const token = getToken();
    if (!token)  navigate('/login');

    const response = await fetch(`${API_URL}/devis/user-actions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            database,
            ...options
        }),
    });

    if (!response.ok) throw new Error('Failed to fetch user actions');

    return response.json();
};


export const fetchAgentsConnections = async (
    navigate: (path: string) => void,
    ) => {
        const token = getToken();
        if (!token) navigate('/login');

        const response = await fetch(`${API_URL}/users/all-users-status`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error('Failed to fetch connected users');

        return response.json();
    };