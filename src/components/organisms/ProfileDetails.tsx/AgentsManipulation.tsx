import React, { useState } from 'react';
import { Button } from '../../../@/components/ui/button';
import { Badge } from '../../../@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../@/components/ui/card';
import { Label } from '../../../@/components/ui/label';
import { Loader, Filter, UserX, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '../../../@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../@/components/ui/select';
import { Input } from '../../../@/components/ui/input';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import useAgentsConnections from '../../../hooks/useAgentsManipulation';
import { useToast } from '../../../hooks/use-toast';
import { Toaster } from '../../../@/components/ui/toaster';
import { activateRemoteUser, forceDisconnectUser } from '../../../services/authService';


interface AgentsManipulationProps {
    initialFilter?: string;
}

const AgentsManipulation: React.FC<AgentsManipulationProps> = ({
    initialFilter = '',
}) => {
    const { toast } = useToast();
    const connectedUserBadge = 'bg-greenOne border border-greenOne hover:bg-greenOne hover:border-greenOne text-whiteSecond cursor-pointer';
    const disconnectedUserBadge = 'bg-lightRed border border-lightRed hover:bg-lightRed hover:border-lightRed text-whiteSecond cursor-pointer';
    const [filter, setFilter] = useState(initialFilter);
    const [usernameFilter, setUsernameFilter] = useState('');
    const [isFilterVisible, setIsFilterVisible] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [processingUsername, setProcessingUsername] = useState<string | null>(null);
    const [isCardLoading, setIsCardLoading] = useState(false); // New state for card loading
    
    const { 
        data, 
        isLoading, 
        isError, 
        error,
        refetch 
    } = useAgentsConnections();

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refetch();
        setIsRefreshing(false);
    };

    const handleFilterChange = (value: string) => {
        setFilter(value);
    };

    // Filter users based on selected filter and username
    const filteredUsers = data?.users?.filter((user) => {
        // Status filter
        const statusMatch = 
            filter === 'connected' ? user.isConnected :
            filter === 'disconnected' ? !user.isConnected :
            true;
        
        // Username filter (case insensitive)
        const usernameMatch = usernameFilter ? 
            user.username.toLowerCase().includes(usernameFilter.toLowerCase()) : 
            true;
        
        return statusMatch && usernameMatch;
    });

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd MMM yyyy à HH:mm', { locale: fr });
        } catch (e) {
            return '-';
        }
    };

    const handleUserConnection = async (username: string, isActive: boolean) => {
        setProcessingUsername(username);
        setIsCardLoading(true); // Start card loading
        console.log(`Traitement de l'utilisateur: ${username}, Actif: ${isActive}`);
        try {
            if (isActive) {
                // Deactivate user
                const result = await forceDisconnectUser(username);
                
                if (result?.message) {
                    toast({
                        title: "Utilisateur désactivé",
                        description: result.message || "L'utilisateur a été désactivé avec succès",
                        variant: "default",
                    });
                }
            } else {
                // Activate user
                const result = await activateRemoteUser(username);
                
                if (result?.message) {
                    toast({
                        title: "Utilisateur activé",
                        description: result.message || "L'utilisateur a été activé avec succès",
                        variant: "default",
                    });
                }
            }

            handleRefresh();
        } catch (error) {
            toast({
                title: "Erreur",
                description: `Une erreur est survenue: ${(error as Error)?.message || "Erreur inconnue"}`,
                variant: "destructive",
            });
        } finally {
            setProcessingUsername(null);
            setIsCardLoading(false); // End card loading
        }
    };

    return (
        <>
        <Toaster tostCloseStyle={''}/>
        <Card className="shadow-md border border-normalGrey/10 transition-all duration-200 rounded-xl overflow-hidden relative">
            {/* Loading overlay */}
            {isCardLoading && (
                <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <Loader className="h-8 w-8 animate-spin text-highBlue" />
                        <span className="mt-2 text-highBlue font-medium">Traitement en cours...</span>
                    </div>
                </div>
            )}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-gradient-to-r from-highBlue to-normalBlue">
                <CardTitle className="text-xl font-oswald text-whiteSecond">
                    Connexions des Agents
                </CardTitle>
                <div className="flex space-x-2">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleRefresh}
                        disabled={isLoading || isRefreshing || isCardLoading}
                        className="text-highBlue hover:text-highBlue hover:bg-normalGrey bg-normalGrey"
                    >
                        {isRefreshing ? (
                            <Loader className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                            <RefreshCw className="h-4 w-4 mr-1" />
                        )}
                        Actualiser
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsFilterVisible(!isFilterVisible)}
                        disabled={isCardLoading}
                        className="text-highBlue hover:text-highBlue hover:bg-normalGrey bg-normalGrey"
                    >
                        <Filter className="h-4 w-4 mr-1" />
                        {isFilterVisible ? 'Masquer les filtres' : 'Afficher les filtres'}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6 bg-whiteSecond">
                {isFilterVisible && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-100 animate-in fade-in-50 duration-150">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="username-filter" className="text-highBlue text-sm font-medium">Nom d'utilisateur</Label>
                                <Input
                                    id="username-filter"
                                    value={usernameFilter}
                                    onChange={(e) => setUsernameFilter(e.target.value)}
                                    placeholder="Rechercher par nom d'utilisateur"
                                    className="border border-normalGrey bg-normalGrey text-highBlue font-oswald"
                                    disabled={isCardLoading}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="status-filter" className="text-highBlue text-sm font-medium">Statut</Label>
                                <Select value={filter} onValueChange={handleFilterChange} disabled={isCardLoading}>
                                    <SelectTrigger id="status-filter" className="w-[180px] border border-normalGrey bg-normalGrey text-highBlue font-oswald">
                                        <SelectValue className="text-highBlue cursor-pointer font-oswald font-bold" placeholder="Filtrer par statut" />
                                    </SelectTrigger>
                                    <SelectContent className="border-normalGrey bg-normalGrey cursor-pointer">
                                        <SelectItem className="text-highBlue cursor-pointer" value="all">Tous</SelectItem>
                                        <SelectItem className="text-highBlue cursor-pointer" value="connected">Connectés</SelectItem>
                                        <SelectItem className="text-highBlue cursor-pointer" value="disconnected">Déconnectés</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                )}
                
                {isLoading ? (
                    <div className="flex justify-center items-center my-10">
                        <Loader className="h-8 w-8 animate-spin text-highBlue" />
                    </div>
                ) : isError ? (
                    <Alert variant="destructive" className="my-4">
                        <AlertDescription>
                            Erreur lors du chargement des données: {(error as Error)?.message || 'Erreur inconnue'}
                        </AlertDescription>
                    </Alert>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-100">
                            <div className="relative overflow-x-auto">
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead className="bg-gradient-to-r from-highBlue/5 to-normalBlue/5">
                                        <tr className="hover:bg-transparent">
                                            <th className="text-highBlue font-oswald px-4 py-3">Nom d'utilisateur</th>
                                            <th className="text-highBlue font-oswald px-4 py-3">Dernière connexion</th>
                                            <th className="text-highBlue font-oswald px-4 py-3">Statut</th>
                                            <th className="text-highBlue font-oswald px-4 py-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers && filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => (
                                                <tr 
                                                    key={user.id} 
                                                    className="hover:bg-gray-50/80 transition-colors border-b border-gray-100/80"
                                                >
                                                    <td className="font-medium text-highBlue px-4 py-3">{user.username}</td>
                                                    <td className="px-4 py-3">{formatDate(user.lastConnectedAt)}</td>
                                                    <td className="px-4 py-3">
                                                        <Badge className={`${user.isConnected ? connectedUserBadge : disconnectedUserBadge} px-2.5 py-1 rounded-md font-medium text-xs`}>
                                                            {user.isConnected ? 'Connecté' : 'Déconnecté'}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center">
                                                            {user.isActive ? (
                                                                <Button 
                                                                    variant="outline" 
                                                                    size="sm" 
                                                                    onClick={() => handleUserConnection(user.username, true)}
                                                                    disabled={processingUsername === user.username || isCardLoading}
                                                                    className="border-lightRed text-lightRed hover:bg-lightRed/10 hover:text-lightRed transition-colors"
                                                                    title="Désactiver l'accès de cet agent"
                                                                >
                                                                    {processingUsername === user.username ? (
                                                                        <Loader className="h-4 w-4 mr-1 animate-spin" />
                                                                    ) : (
                                                                        <UserX className="h-4 w-4 mr-1" />
                                                                    )}
                                                                    <span>Désactiver</span>
                                                                </Button>
                                                            ) : (
                                                                <Button 
                                                                    variant="outline" 
                                                                    size="sm" 
                                                                    onClick={() => handleUserConnection(user.username, false)}
                                                                    disabled={processingUsername === user.username || isCardLoading}
                                                                    className="border-greenOne text-greenOne hover:bg-greenOne/10 hover:text-greenOne transition-colors"
                                                                    title="Activer l'accès de cet agent"
                                                                >
                                                                    {processingUsername === user.username ? (
                                                                        <Loader className="h-4 w-4 mr-1 animate-spin" />
                                                                    ) : (
                                                                        <RefreshCw className="h-4 w-4 mr-1" />
                                                                    )}
                                                                    <span>Activer</span>
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="text-center text-gray-500 py-12">
                                                    <div className="flex flex-col items-center justify-center space-y-2">
                                                        <UserX className="h-8 w-8 text-gray-300" />
                                                        <p>Aucun agent trouvé</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        {data && (
                            <div className="text-center mt-4 text-sm text-gray-500">
                                <p>Nombre total d'utilisateurs: {data.totalUsers}</p>
                                <p>Utilisateurs connectés: {data.connectedUsersCount}</p>
                                <p>Nombre total de connexions: {data.totalConnections}</p>
                                <p>Données mises à jour le: {formatDate(data.timestamp)}</p>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
        </>
    );
};

export default AgentsManipulation;
