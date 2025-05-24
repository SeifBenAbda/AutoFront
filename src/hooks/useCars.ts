// src/hooks/useCarModels.ts
import { useQuery } from '@tanstack/react-query';
import { fetchCarModels, fetchCarModelsFacture, fetchCarsPaginated } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { databaseName } from '../utils/shared_functions';

export interface CarModel {
    carId: number;
    carModel: string;
    carName: string;
    isAvailable: boolean;
    addedBy: string;
    addAt: string;
    modelYear: number;
    price: number;
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



export interface CarModelFacture {
    CarModelsFacture: string[];
}


export const useCarModelsFacture = () => {
    const navigate = useNavigate(); // Move the useNavigate call here inside the hook

    return useQuery<CarModelFacture>({
        queryKey: ['carModelsFacture'],
        queryFn: () => fetchCarModelsFacture(databaseName, navigate), // Pass navigate to the fetchCarModels function
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
}


// Interface for paginated response
export interface PaginatedCarsResponse {
    cars: CarModel[];
    total: number;
    page: number;
    totalPages: number;
}

// Hook for fetching paginated cars
export const useCarsPaginated = (page: number = 1, pageSize: number = 7) => {
    const navigate = useNavigate();

    return useQuery<PaginatedCarsResponse>({
        queryKey: ['carsPaginated', page, pageSize],
        queryFn: () => fetchCarsPaginated(databaseName, page, pageSize, navigate),
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
};