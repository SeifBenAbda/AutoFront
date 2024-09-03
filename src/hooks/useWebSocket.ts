import { CarRequest, Client, Devis, ItemRequest, Rappel } from '@/types/devisTypes';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import io from 'socket.io-client'; // Import socket.io-client

// Define the URL of your Socket.io server
const SOCKET_URL = import.meta.env.VITE_API_URL; // Replace with your server URL

export const useWebSocketForDevis = (page: number, searchValue?: string, status?: string, priority?: string, cars?: string[]) => {
  const queryClient = useQueryClient();
  const queryKey = ['data', page, searchValue, status, priority, cars];

  useEffect(() => {
    // Initialize socket connection
    const socket = io(SOCKET_URL);

    // Listen for 'devisUpdate' events
    socket.on('devisUpdate', (data: {
      client?: Client;
      devis?: Devis;
      carRequest?: CarRequest;
      itemRequest?: ItemRequest;
      rappelDevis?: Rappel;
    }) => {
      // Invalidate the query cache when a change is detected
      queryClient.invalidateQueries({ queryKey });

      // Update the cache with the new data
      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return data; // Return new data if old data is not present
        return updateData(oldData, data);
      });
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.off('devisUpdate');
      socket.close();
    };
  }, [page, searchValue, status, priority, cars, queryClient]);

  return null;
};

// Function to merge new data with old data
const updateData = (oldData: any, newData: any) => {
  // Merge new data with old data as needed
  const updatedData = { ...oldData };

  if (newData.client) {
    updatedData.client = newData.client;
  }
  if (newData.devis) {
    updatedData.devis = newData.devis;
  }
  if (newData.carRequest) {
    updatedData.carRequest = newData.carRequest;
  }
  if (newData.itemRequest) {
    updatedData.itemRequest = newData.itemRequest;
  }
  if (newData.rappelDevis) {
    updatedData.rappelDevis = newData.rappelDevis;
  }

  return updatedData;
};
