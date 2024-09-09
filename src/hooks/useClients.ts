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
    staleTime: 0, // Data is always considered stale
    refetchOnWindowFocus: false, // Optional: Disable refetching on window focus if not needed
  });
};

export default useClients;
