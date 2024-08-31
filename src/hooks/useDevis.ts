// src/hooks/useDevis.ts
import { CarRequest, Client, Devis, ItemRequest } from '../types/devisTypes';
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

const useDevis = (page: number, searchValue?: string) => {
  return useQuery<ApiResponse>({
    queryKey: ['data', page, searchValue],
    queryFn: () => fetchDevisAllData("Commer_2024_AutoPro", searchValue, page),
    refetchInterval: 5000,
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
    }: {
      database: string;
      client: Client;
      devis: Devis;
      carRequestData?: CarRequest;
      itemRequestData?: ItemRequest;
    }) => {
      return createDevis(database, client, devis, itemRequestData, carRequestData);
    },
    onSuccess: (data) => {
      // Handle success (e.g., show a notification, invalidate queries)
      console.log(`New Data ${data} Successfully Created`);
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
      console.log(`Error ${error} Happened During Creating Devis`);
    },
  });
};

export default useDevis;
