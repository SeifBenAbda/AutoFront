// src/hooks/useCarModels.ts
import { useQuery } from '@tanstack/react-query';
import { fetchDocCheck } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { state } from '../utils/shared_functions';

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
        queryFn: () => fetchDocCheck(state.databaseName, clientType, payementType, navigate), // Pass navigate to the fetchCarModels function
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
};

export default useDocsCheck;
