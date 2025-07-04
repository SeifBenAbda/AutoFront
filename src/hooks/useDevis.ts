// src/hooks/useDevis.ts (Stable version)
import { CarRequest, Client, Devis, DevisFacture, DevisGesteCommer, DevisPayementDetails, DevisReserved, Rappel } from '../types/devisTypes';
import { createDevis, deletedDevis, fetchDevisAllData, resetDevisData, updateDevis } from '../services/apiService';
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
  assignedTo?: string,
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
    assignedTo,
    status, 
    priority, 
    cars, 
    clients, 
    dateRappelFrom?.toISOString(), // Convert dates to strings for stable comparison
    dateRappelTo?.toISOString()
  ], [page, searchValue, assignedTo, status, priority, cars, clients, dateRappelFrom, dateRappelTo]);

  // Initialize WebSocket - this should only run once per component
  const isConnected = useWebSocketForDevis(page, searchValue, assignedTo, status, priority, cars);

  const query = useQuery<ApiResponse>({
    queryKey,
    queryFn: async () => {
      const result = await fetchDevisAllData(
        state.databaseName, 
        searchValue, 
        assignedTo,
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
    staleTime: 0, 
    gcTime: 0,
    refetchOnWindowFocus: false,
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
      rappelData?: Rappel[];
      devisPayementDetails: DevisPayementDetails;
    }) => {  
      return createDevis(
        params.database, 
        params.client, 
        params.devis, 
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



export const useDevisResetData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      database: string;
      devisId: number;
    }) => {
      return resetDevisData(params.database, params.devisId);
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
}