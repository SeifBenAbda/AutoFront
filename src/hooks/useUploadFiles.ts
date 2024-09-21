import { useMutation } from '@tanstack/react-query';
import { uploadDocuments } from '../services/apiService'; // Adjust the import path as needed
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

const useUploadFiles = (navigate: (path: string) => void) => {
    return useMutation<UploadResponse, Error, { devisId?: number; files: File[] }>({
        mutationFn: async ({devisId, files }) => {
            // Pass the array of files to uploadDocuments
            return await uploadDocuments("Commer_2024_AutoPro", devisId!, files, navigate);
        },
        onError: (error) => {
            // Handle error if needed
            console.error('Upload error:', error);
        },
        onSuccess: (data) => {
            // Handle success if needed
            console.log('Upload successful:', data);
        },
    });
};

export default useUploadFiles;
