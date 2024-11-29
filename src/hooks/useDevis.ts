// src/hooks/useDevis.ts
import { CarRequest, Client, Devis, DevisFacture, DevisGesteCommer, DevisPayementDetails, DevisReserved, ItemRequest, Rappel } from '../types/devisTypes';
import { createDevis, deletedDevis, fetchDevisAllData, updateDevis } from '../services/apiService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useWebSocketForDevis } from './useWebSocket';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL; // Replace with your server URL

// Initialize WebSocket connection outside the hook to prevent creating multiple instances
const socket = io(SOCKET_URL);

interface ApiResponse {
  data: Devis[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

const useDevis = (page: number, searchValue?: string, status?: string, priority?: string, cars?: string[]) => {
  useWebSocketForDevis(page, searchValue, status, priority, cars);

  return useQuery<ApiResponse>({
    queryKey: ['data', page, searchValue, status, priority, cars], // Include all dependencies in the key
    queryFn: () => fetchDevisAllData("Commer_2024_AutoPro", searchValue, page, status, priority, cars),
    staleTime: Infinity, // Keep data fresh indefinitely, as it's updated via WebSocket
    refetchOnWindowFocus: false, // Disable refetching on window focus
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
      updatedRappels,
      updatedDevisFacture,
      updatedDevisReserved,
      updatedDevisPayementDetails,
      updatedDevisGesteCommerciale
    }: {
      database: string;
      devisId: number;
      clientId: number;
      updatedDevis: Partial<Devis>;
      updatedClient?: Partial<Client>;
      updatedItemRequestData?: Partial<ItemRequest>;
      updatedCarRequestData?: Partial<CarRequest>;
      updatedRappels?: Partial<Rappel[]>;
      updatedDevisFacture?: Partial<DevisFacture>;
      updatedDevisReserved?: Partial<DevisReserved>;
      updatedDevisPayementDetails?: Partial<DevisPayementDetails>;
      updatedDevisGesteCommerciale?: Partial<DevisGesteCommer>;
    }) => {
      return updateDevis(
        database,
        devisId,
        clientId,
        updatedDevis,
        updatedClient,
        updatedItemRequestData,
        updatedCarRequestData,
        updatedRappels,
        updatedDevisFacture,
        updatedDevisReserved,
        updatedDevisPayementDetails,
        updatedDevisGesteCommerciale
      );
    },
    // Optional: Define onSuccess, onError, etc.
    onSuccess: (data) => {
      // Handle success (e.g., show a notification, invalidate queries)
      socket.emit('devisUpdate', {
        client: data.client,
        devis: data.devis,
        carRequest: data.carRequest,
        itemRequest: data.itemRequest,
        //rappelDevis: data.rappelDevis,
      });
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
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
      rappelData,
      devisPayementDetails
    }: {
      database: string;
      client: Client;
      devis: Devis;
      carRequestData?: CarRequest;
      itemRequestData?: ItemRequest[];
      rappelData?: Rappel[],
      devisPayementDetails : DevisPayementDetails
    }) => {
      return createDevis(database, client, devis, itemRequestData, carRequestData, rappelData,devisPayementDetails);
    },
    onSuccess: (data) => {
    },
    onError: (error) => {
    },
  });
};


export const useDeletedDevis = () => {
  return useMutation({
    mutationFn: async ({
      database,
      devisId,
      deletedBy
    }: {
      database: string;
      devisId: number;
      deletedBy: string;
    }) => {
      return deletedDevis(
        database,
        devisId,
        deletedBy
      );
    },
    // Optional: Define onSuccess, onError, etc.
    onSuccess: (data) => {
      // Handle success (e.g., show a notification, invalidate queries)
      socket.emit('devisUpdate', {
        client: data.devis!.client,
        devis: data.devis,
        //rappelDevis: data.rappelDevis,
      });
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
    },
  });
};

export default useDevis;


