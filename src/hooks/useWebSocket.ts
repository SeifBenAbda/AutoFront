// src/hooks/useWebSocket.ts (Stable version)
import { CarRequest, Client, Devis, Rappel } from '@/types/devisTypes';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useCallback, useMemo } from 'react';
import io, { Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL;

// Global socket instance and listener management
let socket: Socket | null = null;
let globalListenerAttached = false;
let activeHookCount = 0;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
     
    });

    socket.on('disconnect', (reason) => {
    
    });

    socket.on('connect_error', (error) => {
    });
  }
  return socket;
};

// Global handler function that won't change reference
const createGlobalDevisUpdateHandler = (queryClient: any) => {
  return (data: {
    client?: Client;
    devis?: Devis;
    carRequest?: CarRequest;
    rappelDevis?: Rappel;
  }) => { 
    // Invalidate all data queries - this will refetch all active devis queries
    queryClient.invalidateQueries({ 
      queryKey: ['data'],
      exact: false // This will match all queries that start with ['data']
    });
  };
};

export const useWebSocketForDevis = (
  page: number, 
  searchValue?: string, 
  status?: string, 
  priority?: string, 
  cars?: string[]
) => {
  const queryClient = useQueryClient();
  const mountedRef = useRef(true);

  // Stable query key using useMemo
  const queryKey = useMemo(() => 
    ['data', page, searchValue, status, priority, cars], 
    [page, searchValue, status, priority, cars]
  );

  useEffect(() => {
    const socketInstance = getSocket();
    activeHookCount++;
    // Only attach the global listener once
    if (!globalListenerAttached) {
      const globalHandler = createGlobalDevisUpdateHandler(queryClient);
      socketInstance.on('devisUpdate', globalHandler);
      globalListenerAttached = true;
    }

    // Cleanup function
    return () => {
      if (mountedRef.current) {
        activeHookCount--;
        // Only remove listener when no hooks are active
        if (activeHookCount === 0 && socket && globalListenerAttached) {
          socket.off('devisUpdate');
          globalListenerAttached = false;
        }
      }
    };
  }, []); // Empty dependency array - only run once per component mount

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return socket?.connected || false;
};