// src/hooks/useCarModels.ts
import { useQuery } from '@tanstack/react-query';
import {fetchBanksAndLeasing } from '../services/apiService';
import { state } from '../utils/shared_functions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addBankOrLeasing} from '../services/apiService';

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



export const useAddBankOrLeasing = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {name: string, type: string}) =>
            addBankOrLeasing(state.databaseName, data.name, data.type),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banksAndLeasing'] });
        },
    });
}