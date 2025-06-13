import { useMutation ,UseMutateAsyncFunction, useQuery  } from '@tanstack/react-query';
import { generateBcInterne, getDevisFiles, getUrlFiles, streamFile, uploadDocuments } from '../services/apiService'; // Adjust the import path as needed
import { state } from '../utils/shared_functions';

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
    navigate: (path: string) => void;
}

export const useUploadFiles = ({ devisId, navigate }: UseUploadFilesProps) => {
    const uploadFilesMutation = useMutation({
        mutationFn: (files: { file: File; typeDocument: string }[]) => 
            uploadDocuments(state.databaseName, devisId, files, navigate),
    });
    
    return uploadFilesMutation;
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
    typeDocument : string;
}

export const useUrlFiles = (
    devisId: number, 
    navigate: (path: string) => void
): { mutateAsync: UseMutateAsyncFunction<FileData, Error, string, unknown> } => {
    return useMutation<FileData, Error, string>({
        mutationFn: async (filename: string) => {
            const response = await getUrlFiles(state.databaseName, devisId.toString(), filename, navigate);

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
        queryFn: () => getDevisFiles(state.databaseName, devisId.toString(), navigate),
        staleTime: 0, // Keep data fresh indefinitely, as it may be updated via WebSocket
        refetchOnWindowFocus: true, // Disable refetching on window focus
    });
};



export interface generateBcInterneResponse {
    status: number;
    result: string;
}


export const useGenerateBcInterne = (devisId: number, navigate: (path: string) => void) => {
    return useMutation<generateBcInterneResponse, Error, { database: string, devisId: number, navigate: (path: string) => void }>({
        mutationFn: ({ database, devisId, navigate }) => generateBcInterne(database, devisId, navigate),
    });
};