// src/hooks/useData.ts
import { Devis } from '../types/devisTypes';
import {fetchDevisAllData } from '../services/apiService';
import { useQuery } from '@tanstack/react-query';
import io from 'socket.io-client';

const socket = io('http://localhost:3000/');

interface ApiResponse {
    data: Devis[];
    meta: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
    };
  }
const useDevis = (page: number) => {
    return useQuery({
      queryKey: ['data', page],
      queryFn: () => fetchDevisAllData("Commer_2024_AutoPro",undefined,page),
      refetchInterval: 5000, // Refetch data every 5 seconds
      select: (response: ApiResponse) => response, // Return the entire ApiResponse
    });
  };

export default useDevis;
