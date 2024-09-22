import { useMutation ,UseMutateAsyncFunction, useQuery  } from '@tanstack/react-query';
import { getDevisFiles, getUrlFiles, streamFile, uploadDocuments } from '../services/apiService'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom';

interface UploadResponse {
    status: number;
    documents: {
        DevisId: string;
        file_name: string;
        file_path: string;
        mime_type: string;
        file_size: number;
        id: number;
        uploaded_at: string;
    }[];
}




interface UseUploadFilesProps {
    devisId: number;
    files: File[];
    navigate: (path: string) => void;
}
export const useUploadFiles = ({ devisId, files, navigate }: UseUploadFilesProps) => {
    return useQuery({
      queryKey: ['devisFiles', devisId, files], // Unique key including files to trigger query on change
      queryFn: () => uploadDocuments("Commer_2024_AutoPro", devisId, files, navigate),
      enabled: files.length > 0, // Only enable the query if there are files to upload
      staleTime: 2000,
      refetchOnWindowFocus: false, // You can adjust this depending on your needs
    });
  };





export const useStreamFile = (navigate: (path: string) => void): {
    mutateAsync: UseMutateAsyncFunction<Blob, Error, string, unknown>;
} => {
    return useMutation<Blob, Error, string>({
        mutationFn: async (filename: string) => {
            const response = await streamFile(filename, navigate);

            if (!response) {
                throw new Error('Failed to fetch file');
            }

            return response;
        },
        onError: (error) => {
            console.error('Error streaming file:', error);
        },
    });
};



export interface FileData {
    id: number;
    DevisId: number;
    file_name: string;
    file_path: string;
    mime_type: string;
    file_size: number;
    uploaded_at: string;
}

export const useUrlFiles = (
    devisId: number, 
    navigate: (path: string) => void
): { mutateAsync: UseMutateAsyncFunction<FileData, Error, string, unknown> } => {
    return useMutation<FileData, Error, string>({
        mutationFn: async (filename: string) => {
            const response = await getUrlFiles("Commer_2024_AutoPro", devisId.toString(), filename, navigate);

            if (!response) {
                throw new Error('Failed to fetch file');
            }

            const data: FileData = await response.json();

            return data;
        },
        onError: (error) => {
            console.error('Error fetching file data:', error);
        },
    });
};


export const useDevisFiles = (
    devisId: number,
    navigate: (path: string) => void
) => {
    return useQuery<FileData[], Error>({
        queryKey: ['devisFiles', devisId], // Unique key based on devisId
        queryFn: () => getDevisFiles("Commer_2024_AutoPro", devisId.toString(), navigate),
        staleTime: 0, // Keep data fresh indefinitely, as it may be updated via WebSocket
        refetchOnWindowFocus: true, // Disable refetching on window focus
    });
};



