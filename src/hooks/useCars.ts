// src/hooks/useCarModels.ts
import { useQuery } from '@tanstack/react-query';
import { fetchCarModels } from '../services/apiService';

interface CarModel {
    carId: number;
    carModel: string;
    carName: string;
    isAvailable: boolean;
    addedBy: string;
    addAt: string;
    modelYear: number;
}

const useCarModels = () => {
    return useQuery<CarModel[]>({
        queryKey: ['carModels'],
        queryFn: () => fetchCarModels("Commer_2024_AutoPro"),
        //refetchInterval: 5000,
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
};

export default useCarModels;
