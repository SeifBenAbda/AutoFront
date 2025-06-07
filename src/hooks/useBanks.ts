// src/hooks/useCarModels.ts
import { useQuery } from '@tanstack/react-query';
import {fetchBanksAndLeasing } from '../services/apiService';
import { state } from '../utils/shared_functions';

interface BanksAndLeasing {
    id: number;
    name: string;
    type: string;
}

const useBanksAndLeasing = () => {
    return useQuery<BanksAndLeasing[]>({
        queryKey: ['banksAndLeasing'],
        queryFn: () => fetchBanksAndLeasing(state.databaseName),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};

export default useBanksAndLeasing;
