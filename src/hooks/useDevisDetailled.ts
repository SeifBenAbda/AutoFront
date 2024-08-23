// src/hooks/useData.ts
import { useQuery } from '@tanstack/react-query';
import {fetchDevisDetailled } from '../services/apiService';
import io from 'socket.io-client';

const socket = io('http://localhost:3000/');



const useDevisDetailled = (page: number) => {
  return useQuery({
    queryKey: ['data', page],
    queryFn: () => fetchDevisDetailled(page),
    refetchInterval: 5000, // Refetch data every 5 seconds
    select: (response) => response.data, // Extract data from ApiResponse
    // No need to specify the data type here as it is inferred from `select`
  });
};

export default useDevisDetailled;
