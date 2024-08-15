// src/hooks/useData.ts
import { useQuery } from '@tanstack/react-query';
import { fetchDataMvtVenLi } from '../services/apiService';

const useMvtVenLi = (page: number) => {
  return useQuery({
    queryKey: ['data', page],
    queryFn: () => fetchDataMvtVenLi(page),
    refetchInterval: 5000, // Refetch data every 5 seconds
    select: (response) => response.data, // Extract data from ApiResponse
    // No need to specify the data type here as it is inferred from `select`
  });
};

export default useMvtVenLi;
