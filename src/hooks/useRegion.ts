// src/hooks/useCarModels.ts
import { useQuery } from '@tanstack/react-query';
import {fetchRegions } from '../services/apiService';

interface Region {
    RegionID: number;
    CityName: string;
    RegionName: string;
}

const useRegions = () => {
    return useQuery<Region[]>({
        queryKey: ['regions'],
        queryFn: () => fetchRegions("Commer_2024_AutoPro"),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};

export default useRegions;
