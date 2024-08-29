import { Devis } from "../types/devisTypes";
import { getToken } from './authService';

const API_URL = import.meta.env.VITE_API_URL;


export const fetchUserData = async () => {
  const token = getToken();
  if (!token) throw new Error('No token found fethcu ser data');

  const response = await fetch(`${API_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch user data');

  return response.json();
};



interface ApiResponse {
  data: Devis[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

export const fetchDevisDetailled = async (page: number): Promise<ApiResponse> => {
  const token = getToken();

  if (!token) {
    throw new Error('No token found fetchMVTVENLI');
  }
  const response = await fetch(`${API_URL}/mvt-venli?page=${page}`,

    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};



export const fetchDevisAllData = async (
  database: string,
  clientName?: string,
  page: number = 1
): Promise<ApiResponse> => {
  const token = getToken();

  if (!token) {
    throw new Error('No token found');
  }

  const endpoint = clientName!="" || clientName ? '/devis/filter-client' : '/devis/completeDevis';
  const body = clientName!="" || clientName 
    ? { database, clientName, page }
    : { database, page };

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};


export const fetchCarModels = async (databasename:string) => {
  console.log(`${API_URL}/cars`)
  const token = getToken();
  if (!token) throw new Error('No token found');
  const body = {"database":databasename}
  const response = await fetch(`${API_URL}/cars`, {
    method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
  });

  if (!response.ok) {
      throw new Error('Failed to fetch car models');
  }

  return response.json();
};
