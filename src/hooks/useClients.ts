import { useQuery } from '@tanstack/react-query';
import {fetchClients } from '../services/apiService';
import { Client } from '@/types/devisTypes';

interface ApiResponse {
    data: Client[];
    meta: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
    };
  }

const useClients = (page: number, searchValue?: string) => {
  return useQuery<ApiResponse>({
    queryKey: ['data', page, searchValue], // Include all dependencies in the key
    queryFn: () => fetchClients("Commer_2024_AutoPro", searchValue, page),
    staleTime: Infinity, // Keep data fresh indefinitely, as it's updated via WebSocket
    refetchOnWindowFocus: false, // Disable refetching on window focus
  });
};

export default useClients;
