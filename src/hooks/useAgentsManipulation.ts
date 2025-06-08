import { useQuery } from "@tanstack/react-query";
import { fetchAgentsConnections } from "../services/profileService";
import { useNavigate } from "react-router-dom";
import { activateRemoteUser, forceDisconnectUser } from "../services/authService";

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



