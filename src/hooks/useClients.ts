import { useQuery } from '@tanstack/react-query';
import {fetchClients, fetchClientsAll } from '../services/apiService';
import { Client } from '@/types/devisTypes';
import { useNavigate } from 'react-router-dom';
import { databaseName } from '../utils/shared_functions';

interface ApiResponse {
    data: Client[];
    meta: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
    };
  }

export const useClients = (page: number, searchValue?: string) => {
  return useQuery<ApiResponse>({
    queryKey: ['clients', page, searchValue], // Include all dependencies in the key
    queryFn: () => fetchClients(databaseName, searchValue, page),
    staleTime: 0, // Data is always considered stale
    refetchOnWindowFocus: false, // Optional: Disable refetching on window focus if not needed
  });
};



const useClientsList = () => {
    return useQuery<Client[]>({
        queryKey: ['clients'],
        queryFn: () => fetchClientsAll(databaseName), // Pass navigate to the fetchCarModels function
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
};

export default useClientsList;
