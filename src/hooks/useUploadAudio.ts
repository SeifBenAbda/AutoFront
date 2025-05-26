// useAudioUpload.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { getAudioFiles, uploadAudio } from '../services/apiService'
import { databaseName } from '../utils/shared_functions';
interface UseAudioUploadProps {
    devisId: number; // Remain the same
    navigate: (path: string) => void; // Remain the same
  }

  export const useAudioUpload = ({ devisId, navigate }: UseAudioUploadProps) => {
    return useMutation({
      mutationFn: async (formData: FormData) => {
        return await uploadAudio(formData, navigate); // Pass FormData to uploadAudio
      },
      onSuccess: () => {
        // Handle successful upload, maybe you can add a refetch here if needed
        getAudioFiles(databaseName, devisId,navigate);
      },
      onError: (error) => {
        console.error('Error uploading audio:', error);
      },
    });
  };



interface UseGetAudioFilesProps {
    devisId: number;
    navigate: (path: string) => void;
}
export const useGetAudioFiles = ({devisId ,navigate}: UseGetAudioFilesProps) => {
    return useQuery({
      queryKey: ['audioFiles', devisId], // Query key includes both database and devisId
      queryFn: () => getAudioFiles(databaseName, devisId,navigate), // API call function (to be implemented)
      enabled: !!devisId, // Only fetch if both database and devisId are provided
      staleTime: 5000, // Adjust the stale time as per your requirement
      refetchOnWindowFocus: false, // You can adjust this depending on your needs
    });
  };