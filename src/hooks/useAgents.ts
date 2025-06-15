import { User } from '@/models/user.model';
import { fetchAgentNames, fetchAgentsHistory } from '../services/profileService';
import { state } from '../utils/shared_functions';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';



export interface AgentsHistory {
    id: number;
    username: string;
    action: string;
    entityId: number;
    entityType: string;
    timestamp: string | Date;
    additionalInfo: string | null;
}

export interface PaginationMeta {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

export interface AgentsHistoryResponse {
    data: AgentsHistory[];
    meta: PaginationMeta;
    agents: string[];
    entityTypes: string[];
}

const useAgentsHistory = (username?:string,entityType?:string,fromDate?:Date,toDate?:Date,page?:number) => {
    const navigate = useNavigate(); // Move the useNavigate call here inside the hook

    return useQuery<AgentsHistoryResponse>({
        queryKey: ['agentsHistory', username, entityType, fromDate, toDate, page],
        queryFn: () => fetchAgentsHistory(state.databaseName,navigate, { username, entityType, fromDate, toDate, page }), // Pass navigate to the fetchAgentsHistory function
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
};

export default useAgentsHistory;



export const useAgentNames = () => {
     const navigate = useNavigate(); // Move the useNavigate call here inside the hook

    return useQuery<User[]>({
        queryKey: ['agentNames'],
        queryFn: () => fetchAgentNames(navigate), // Pass navigate to the fetchAgentsHistory function
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
};