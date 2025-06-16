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

export const fetchAgentDatabaseAccess = async (
    navigate: (path: string) => void,
    username:string
) => {
    const token = getToken();
    if (!token) navigate('/login');

    const response = await fetch(`${API_URL}/agent-database-access/get-all-accesses`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
    });

    if (!response.ok) throw new Error('Failed to fetch agent database access');

    return response.json();
};


export const grantAgentDatabaseAccess = async (
    navigate: (path: string) => void,
    username: string,
    databaseName: string
) => {
    const token = getToken();
    if (!token) navigate('/login');

    const response = await fetch(`${API_URL}/agent-database-access/grant-access`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, databaseName }),
    });

    if (!response.ok) throw new Error('Failed to grant database access');

    return response.json();
};


export const revokeAgentDatabaseAccess = async (
    navigate: (path: string) => void,
    username: string,
    databaseName: string
) => {
    const token = getToken();
    if (!token) navigate('/login');

    const response = await fetch(`${API_URL}/agent-database-access/revoke-access`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, databaseName }),
    });

    if (!response.ok) throw new Error('Failed to revoke database access');

    return response.json();
};


export const fetchAgentNames = async (
    navigate: (path: string) => void
) => {
    const token = getToken();
    if (!token) navigate('/login');

    const response = await fetch(`${API_URL}/users/all`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) throw new Error('Failed to fetch agent names');

    return response.json();
}
