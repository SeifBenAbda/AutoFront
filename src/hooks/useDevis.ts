// src/hooks/useDevis.ts
import { CarRequest, Client, Devis, ItemRequest, Rappel } from '../types/devisTypes';
import { createDevis, fetchDevisAllData, updateDevis } from '../services/apiService';
import { useMutation, useQuery } from '@tanstack/react-query';

interface ApiResponse {
  data: Devis[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

const useDevis = (page: number, searchValue?: string, status?: string, priority?: string, cars?: string[]) => {
  return useQuery<ApiResponse>({
    queryKey: ['data', page, searchValue, status, priority, cars], // Include all dependencies in the key
    queryFn: () => fetchDevisAllData("Commer_2024_AutoPro", searchValue, page, status, priority, cars),
    refetchInterval: 5000, // Optional: keeps refetching every 5 seconds
    select: (response: ApiResponse) => response,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};


export const useUpdateDevis = () => {
  return useMutation({
    mutationFn: async ({
      database,
      devisId,
      clientId,
      updatedDevis,
      updatedClient,
      updatedItemRequestData,
      updatedCarRequestData,
    }: {
      database: string;
      devisId: number;
      clientId: number;
      updatedDevis: Partial<Devis>;
      updatedClient?: Partial<Client>;
      updatedItemRequestData?: Partial<ItemRequest>;
      updatedCarRequestData?: Partial<CarRequest>;
    }) => {
      return updateDevis(
        database,
        devisId,
        clientId,
        updatedDevis,
        updatedClient,
        updatedItemRequestData,
        updatedCarRequestData
      );
    },
    // Optional: Define onSuccess, onError, etc.
    onSuccess: (data) => {
      // Handle success (e.g., show a notification, invalidate queries)
      console.log(`New Data ${data} Is Succesffuy Updated`)
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
      console.log(`This Error | ${error} Happened During Updating Devis`)
    },
  });
};



export const useCreateDevis = () => {
  return useMutation({
    mutationFn: async ({
      database,
      client,
      devis,
      carRequestData,
      itemRequestData,
      rappelData
    }: {
      database: string;
      client: Client;
      devis: Devis;
      carRequestData?: CarRequest;
      itemRequestData?: ItemRequest;
      rappelData?: Rappel[]
    }) => {
      return createDevis(database, client, devis, itemRequestData, carRequestData, rappelData);
    },
    onSuccess: (data) => {
      console.log(`New Data ${data} Successfully Created`);
    },
    onError: (error) => {
      console.log(`Error ${error} Happened During Creating Devis`);
    },
  });
};

export default useDevis;
