// src/hooks/useCarModels.ts
import { useQuery } from '@tanstack/react-query';
import { fetchCarModels, fetchDocCheck } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

export interface DocumentCondition {
    ConditionId: number;        
    ClientType: 'Particulier' | 'Entreprise';  
    PaymentType: 'Comptant' | 'Leasing' | 'Banque';  
    DocumentType: string;    
    IsRequired: boolean;     
  }
  

const useDocsCheck = (clientType:string , payementType:string) => {
    const navigate = useNavigate(); // Move the useNavigate call here inside the hook

    return useQuery<DocumentCondition[]>({
        queryKey: ['docsConditions'],
        queryFn: () => fetchDocCheck("Commer_2024_AutoPro",clientType,payementType, navigate), // Pass navigate to the fetchCarModels function
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
};

export default useDocsCheck;
