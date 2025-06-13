// src/hooks/useCarModels.ts
import { useQuery } from '@tanstack/react-query';
import {fetchRegions } from '../services/apiService';
import { state } from '../utils/shared_functions';

interface Region {
    RegionID: number;
    CityName: string;
    RegionName: string;
}

const useRegions = () => {
    return useQuery<Region[]>({
        queryKey: ['regions'],
        queryFn: () => fetchRegions(state.databaseName),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};

export default useRegions;
