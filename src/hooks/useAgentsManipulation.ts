import { useQuery } from "@tanstack/react-query";
import { fetchAgentDatabaseAccess, fetchAgentsConnections } from "../services/profileService";
import { useNavigate } from "react-router-dom";

interface UserConnection {
    id: number;
    username: string;
    email: string;
    isConnected: boolean;
    lastConnectedAt: string;
    isActive: boolean;
}

interface AgentsConnectionsResponse {
    users: UserConnection[];
    totalUsers: number;
    connectedUsersCount: number;
    totalConnections: number;
    timestamp: string;
}

const useAgentsConnections = () => {
    const navigate = useNavigate();

    return useQuery<AgentsConnectionsResponse>({
        queryKey: ['agentsConnections'],
        queryFn: () => fetchAgentsConnections(navigate),
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
};

export default useAgentsConnections;


interface AgentDatabaseAccess {
    database_name: string;
    is_accessed: boolean;
}

export const useAgentDatabaseAccess = (username:string) => {
    const navigate = useNavigate();

    return useQuery<AgentDatabaseAccess[]>({
        queryKey: ['agentDatabaseAccess'],
        queryFn: () => fetchAgentDatabaseAccess(navigate, username),
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
};
