// src/hooks/useCarModels.ts
import { useQuery } from '@tanstack/react-query';
import { fetchCarModels } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { databaseName } from '../utils/shared_functions';

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
        queryFn: () => fetchCarModels(databaseName, navigate), // Pass navigate to the fetchCarModels function
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
};

export default useCarModels;
