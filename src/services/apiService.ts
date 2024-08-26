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



export const fetchDevisAllData = async (database: string, clientName: string | undefined, page: number): Promise<ApiResponse> => {
  const token = getToken();

  if (!token) {
    throw new Error('No token found fetchDataDevisByClientName');
  }

  const response = await fetch(`${API_URL}/devis/completeDevis`, {
    method:"POST",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body:JSON.stringify({
      "database":database,
      "page":page
    })
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};
