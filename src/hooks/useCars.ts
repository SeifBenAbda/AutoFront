// src/hooks/useCarModels.ts
import { useQuery } from '@tanstack/react-query';
import { fetchCarModels } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate(); // Move the useNavigate call here inside the hook

    return useQuery<CarModel[]>({
        queryKey: ['carModels'],
        queryFn: () => fetchCarModels("Commer_2024_AutoPro", navigate), // Pass navigate to the fetchCarModels function
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
};

export default useCarModels;
