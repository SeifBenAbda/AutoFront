import { DataItem } from '../types/mvtvenliTypes';
import { getToken } from './authService';

export const fetchUserData = async () => {
  const token = getToken();
  if (!token) throw new Error('No token found');

  const response = await fetch('/api/user-data', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch user data');

  return response.json();
};



interface ApiResponse {
  data: DataItem[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

export const fetchDataMvtVenLi = async (page: number): Promise<ApiResponse> => {
  const token = getToken();

  if (!token) {
    throw new Error('No token found');
  }
  const response = await fetch(`http://localhost:3000/mvt-venli?page=${page}`,

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
