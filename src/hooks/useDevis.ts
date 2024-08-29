// src/hooks/useDevis.ts
import { Devis } from '../types/devisTypes';
import { fetchDevisAllData } from '../services/apiService';
import { useQuery } from '@tanstack/react-query';

interface ApiResponse {
  data: Devis[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

const useDevis = (page: number, searchValue?: string) => {
  return useQuery<ApiResponse>({
    queryKey: ['data', page, searchValue],
    queryFn: () => fetchDevisAllData("Commer_2024_AutoPro", searchValue, page),
    refetchInterval: 5000,
    select: (response: ApiResponse) => response,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export default useDevis;
