// src/hooks/useDevis.ts (Stable version)
import { CarRequest, Client, Devis, DevisFacture, DevisGesteCommer, DevisPayementDetails, DevisReserved, ItemRequest, Rappel } from '../types/devisTypes';
import { createDevis, deletedDevis, fetchDevisAllData, updateDevis } from '../services/apiService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSocket, useWebSocketForDevis } from './useWebSocket';
import { state } from '../utils/shared_functions';
import { useMemo } from 'react';

interface ApiResponse {
  data: Devis[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

const useDevis = (
  page: number, 
  searchValue?: string, 
  status?: string, 
  priority?: string, 
  cars?: string[], 
  clients?: string[],
  dateRappelFrom?: Date | undefined, 
  dateRappelTo?: Date | undefined
) => {
  // Stable query key using useMemo to prevent unnecessary re-renders
  const queryKey = useMemo(() => [
    'data', 
    page, 
    searchValue, 
    status, 
    priority, 
    cars, 
    clients, 
    dateRappelFrom?.toISOString(), // Convert dates to strings for stable comparison
    dateRappelTo?.toISOString()
  ], [page, searchValue, status, priority, cars, clients, dateRappelFrom, dateRappelTo]);

  // Initialize WebSocket - this should only run once per component
  const isConnected = useWebSocketForDevis(page, searchValue, status, priority, cars);
  
  const query = useQuery<ApiResponse>({
    queryKey,
    queryFn: async () => {
      const result = await fetchDevisAllData(
        state.databaseName, 
        searchValue, 
        page, 
        status, 
        priority, 
        cars, 
        clients, 
        dateRappelFrom, 
        dateRappelTo
      );
      
     
      return result;
    },
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    // Add retry logic
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    ...query,
    isWebSocketConnected: isConnected
  };
};

export const useUpdateDevis = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: {
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
        params.database,
        params.devisId,
        params.clientId,
        params.updatedDevis,
        params.updatedClient,
        params.updatedItemRequestData,
        params.updatedCarRequestData,
        params.updatedRappels,
        params.updatedDevisFacture,
        params.updatedDevisReserved,
        params.updatedDevisPayementDetails,
        params.updatedDevisGesteCommerciale
      );
    },
    onSuccess: (data) => {
      setTimeout(() => {
        queryClient.invalidateQueries({ 
          queryKey: ['data'],
          exact: false 
        });
      }, 100); // Small delay to ensure backend has processed
    },
    onError: (error) => {
    },
  });
};

export const useCreateDevis = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: {
      database: string;
      client: Client;
      devis: Devis;
      carRequestData?: CarRequest;
      itemRequestData?: ItemRequest[];
      rappelData?: Rappel[];
      devisPayementDetails: DevisPayementDetails;
    }) => {  
      return createDevis(
        params.database, 
        params.client, 
        params.devis, 
        params.itemRequestData, 
        params.carRequestData, 
        params.rappelData, 
        params.devisPayementDetails
      );
    },
    onSuccess: (data) => {
      // Invalidate all data queries
      queryClient.invalidateQueries({ 
        queryKey: ['data'],
        exact: false 
      });
    },
    onError: (error) => {
    },
  });
};

export const useDeletedDevis = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: {
      database: string;
      devisId: number;
      deletedBy: string;
    }) => {
      return deletedDevis(params.database, params.devisId, params.deletedBy);
    },
    onSuccess: (data) => {
      // Invalidate all data queries
      queryClient.invalidateQueries({ 
        queryKey: ['data'],
        exact: false 
      });
    },
    onError: (error) => {
    },
  });
};

export default useDevis;