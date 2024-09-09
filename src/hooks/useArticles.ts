import { useQuery } from '@tanstack/react-query';
import { fetchArticles } from '../services/apiService';
import { Article } from '@/types/otherTypes';

interface ApiResponse {
    data: Article[];
    meta: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
    };
  }

const useArticles = (page: number, searchValue?: string) => {
  return useQuery<ApiResponse>({
    queryKey: ['data', page, searchValue], // Include all dependencies in the key
    queryFn: async () => await fetchArticles("Commer_2024_AutoPro", searchValue, page),
    staleTime: 0, // Keep data fresh indefinitely, as it's updated via WebSocket
    refetchOnWindowFocus: false, // Disable refetching on window focus
  });
};

export default useArticles;
