// src/hooks/useCarModels.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { createCar, fetchCarModels, fetchCarModelsFacture, fetchCarsPaginated, updateCar } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { state } from '../utils/shared_functions';
import { io } from 'socket.io-client';
import { CarRequest, Devis } from '../types/devisTypes';


const SOCKET_URL = import.meta.env.VITE_API_URL; // Replace with your server URL

// Initialize WebSocket connection outside the hook to prevent creating multiple instances
const socket = io(SOCKET_URL);

export interface CarModel {
    carId: number;
    carModel: string;
    carName: string;
    isAvailable: boolean;
    addedBy: string;
    addAt: string;
    modelYear: number;
    price: string | number;
}

const useCarModels = () => {
    const navigate = useNavigate(); // Move the useNavigate call here inside the hook

    return useQuery<CarModel[]>({
        queryKey: ['carModels'],
        queryFn: () => fetchCarModels(state.databaseName, navigate), // Pass navigate to the fetchCarModels function
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
        queryFn: () => fetchCarModelsFacture(state.databaseName, navigate), // Pass navigate to the fetchCarModels function
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
export const useCarsPaginated = (page: number = 1, pageSize: number = 7,filter:string) => {
    const navigate = useNavigate();

    return useQuery<PaginatedCarsResponse>({
        queryKey: ['carsPaginated', page, pageSize, filter],
        queryFn: () => fetchCarsPaginated(state.databaseName, page, pageSize, navigate, filter),
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
};


export const useCreateCar = (createdBy: string) => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: (createdCar: Partial<CarModel>) => createCar(state.databaseName, createdCar, createdBy, navigate),
    });
};



// Interface for the response of updateCar function
export interface UpdateCarResponse {
    success: boolean;
    data?: CarModel;
    message?: string;
    affectedDevis?: Devis[];
    updatedCarRequests: CarRequest[];
}

// Hook for editing a car
export const useEditCar = () => {
    const navigate = useNavigate();
    
    return useMutation<UpdateCarResponse, Error, { updatedCar: Partial<CarModel> }>({
        mutationFn: async ({
            updatedCar
        }: {
            updatedCar: Partial<CarModel>;
        }) => {
            return updateCar(state.databaseName, navigate, updatedCar);
        },
        onSuccess: (data) => {
            // Check if the data contains affected devis records
            if (data.affectedDevis && Array.isArray(data.affectedDevis)) {
                // Emit updates for each affected devis with their payment details
                data.affectedDevis.forEach(devis => {
                    socket.emit('devisUpdate', {
                        devisId: devis.DevisId,
                        devis: devis,
                        paymentDetails: devis.devisPayementDetails,
                        carRequest: data.updatedCarRequests.find(request => request.DevisId === devis.DevisId)
                    });
                });
            } else {
                // Fallback if the response structure is different
                socket.emit('devisUpdate', {
                    carId: data.data?.carId,
                    updatedCar: data.data
                });
            }
        },
        onError: (error) => {
            // Handle error, e.g., show an error message
           
        }
    });
};