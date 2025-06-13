// src/hooks/useCarModels.ts
import { useQuery } from '@tanstack/react-query';
import {fetchClientSectors } from '../services/apiService';
import { state } from '../utils/shared_functions';

interface ClientSector {
    SectorID: number;
    SectorName: string;
}

const useClientSectors = () => {
    return useQuery<ClientSector[]>({
        queryKey: ['clientSectors'],
        queryFn: () => fetchClientSectors(state.databaseName),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};

export default useClientSectors;
