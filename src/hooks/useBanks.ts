// src/hooks/useCarModels.ts
import { useQuery } from '@tanstack/react-query';
import {fetchBanksAndLeasing } from '../services/apiService';

interface BanksAndLeasing {
    id: number;
    name: string;
    type: string;
}

const useBanksAndLeasing = () => {
    return useQuery<BanksAndLeasing[]>({
        queryKey: ['banksAndLeasing'],
        queryFn: () => fetchBanksAndLeasing("Commer_2024_AutoPro"),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};

export default useBanksAndLeasing;
