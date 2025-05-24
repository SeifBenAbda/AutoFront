import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '../../../@/components/ui/table';
import { Button } from '../../../@/components/ui/button';
import { Badge } from '../../../@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../@/components/ui/card';
import { Label } from '../../../@/components/ui/label';
import { Loader, Filter, Info } from 'lucide-react';
import { Alert, AlertDescription } from '../../../@/components/ui/alert';
import { DatePicker } from '../../../components/atoms/DateSelector';
import useAgentsHistory from '../../../hooks/useAgents';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../@/components/ui/dialog";
import CustomPagination from '../../../components/atoms/CustomPagination';

interface AgentsHistoryTableProps {
    initialUsername?: string;
    initialEntityType?: string;
}

const AgentsHistoryTable: React.FC<AgentsHistoryTableProps> = ({
    initialUsername = '',
    initialEntityType = '',
}) => {
    const [username, setUsername] = useState(initialUsername);
    const [entityType, setEntityType] = useState(initialEntityType);
    const [fromDate, setFromDate] = useState<Date>(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    const [toDate, setToDate] = useState<Date>(new Date());
    const [page, setPage] = useState(1);
    const [isFilterVisible, setIsFilterVisible] = useState(true);
    
    const { data: response, isLoading, isError, error } = useAgentsHistory(username, entityType, fromDate, toDate, page);
    
    const optionStyle = "text-highBlue cursor-pointer";
    const selectedOptionStyle = "text-highBlue cursor-pointer font-oswald font-bold";

    const getActionColor = (action: string) => {
        const actionLower = action.toLowerCase();
        if (actionLower.includes('creat') || actionLower === 'création') return 'bg-greenOne border border-greenOne hover:bg-greenOne text-whiteSecond dark:bg-green-900 dark:text-green-300';
        if (actionLower.includes('updat') || actionLower === 'mis à jour') return 'bg-highBlue hover:bg-highBlue text-whiteSecond dark:bg-blue-900 dark:text-blue-300';
        if (actionLower.includes('delet') || actionLower === 'suppression') return 'bg-redOne text-red-800 dark:bg-red-900 dark:text-red-300';
        if (actionLower.includes('view') || actionLower === 'consulté') return 'bg-purpleOne text-purple-800 dark:bg-purple-900 dark:text-purple-300';
        if (actionLower.includes('generat')) return 'bg-highYellow border-highYellow hover:bg-highYellow text-highBlue dark:bg-yellow-900 dark:text-yellow-300';
        return 'bg-grayOne text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    };

    const handleFromDateChange = (date: Date | undefined) => {
        if (date) setFromDate(date);
    };

    const handleToDateChange = (date: Date | undefined) => {
        if (date) setToDate(date);
    };

    const handleAgentChange = (value: string) => {
        setUsername(value);
        setPage(1); // Reset to first page when changing filters
    };

    const handleEntityTypeChange = (value: string) => {
        setEntityType(value);
        setPage(1); // Reset to first page when changing filters
    };

    return (
        <Card className="shadow-md border border-normalGrey/10 transition-all duration-200 rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-gradient-to-r from-highBlue to-normalBlue">
                <CardTitle className="text-xl font-oswald text-whiteSecond">
                    Historique des Actions des Agents
                </CardTitle>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                    className="text-highBlue hover:text-highBlue hover:bg-normalGrey bg-normalGrey"
                >
                    <Filter className="h-4 w-4 mr-1" />
                    {isFilterVisible ? 'Masquer les filtres' : 'Afficher les filtres'}
                </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-6 bg-whiteSecond">
                {isFilterVisible && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-100 animate-in fade-in-50 duration-150">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="username" className="text-highBlue text-sm font-medium">Agent</Label>
                                <Select value={username} onValueChange={handleAgentChange}>
                                    <SelectTrigger className="w-full border border-normalGrey bg-normalGrey text-highBlue font-oswald">
                                        <SelectValue className={selectedOptionStyle} placeholder="Sélectionner un agent" />
                                    </SelectTrigger>
                                    <SelectContent className="border-normalGrey bg-normalGrey cursor-pointer">
                                        <SelectItem className={optionStyle} value="all">Tous</SelectItem>
                                        {response?.agents?.map((agent) => (
                                            <SelectItem key={agent} className={optionStyle} value={agent}>
                                                {agent}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-1">
                                <Label htmlFor="entityType" className="text-highBlue text-sm font-medium">Type d'entité</Label>
                                <Select value={entityType} onValueChange={handleEntityTypeChange}>
                                    <SelectTrigger className="w-full border border-normalGrey bg-normalGrey text-highBlue font-oswald">
                                        <SelectValue className={selectedOptionStyle} placeholder="Sélectionner un type d'entité" />
                                    </SelectTrigger>
                                    <SelectContent className="border-normalGrey bg-normalGrey cursor-pointer">
                                        <SelectItem className={optionStyle} value="all">Tous</SelectItem>
                                        {response?.entityTypes?.map((type) => (
                                            <SelectItem key={type} className={optionStyle} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="fromDate" className="text-highBlue text-sm font-medium">Date de début</Label>
                                <DatePicker
                                    value={fromDate}
                                    onChange={handleFromDateChange}
                                    fromYear={new Date().getFullYear()-1}
                                    toYear={new Date().getFullYear()}
                                />
                            </div>
                            
                            <div className="space-y-1">
                                <Label htmlFor="toDate" className="text-highBlue text-sm font-medium">Date de fin</Label>
                                <DatePicker
                                    value={toDate}
                                    onChange={handleToDateChange}
                                    fromYear={new Date().getFullYear()-1}
                                    toYear={new Date().getFullYear()}
                                />
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
                            <Table>
                                <TableHeader className="bg-gradient-to-r from-highBlue/5 to-normalBlue/5">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-highBlue font-oswald">ID</TableHead>
                                        <TableHead className="text-highBlue font-oswald">Agent</TableHead>
                                        <TableHead className="text-highBlue font-oswald">Action</TableHead>
                                        <TableHead className="text-highBlue font-oswald">ID Entité</TableHead>
                                        <TableHead className="text-highBlue font-oswald">Type d'Entité</TableHead>
                                        <TableHead className="text-highBlue font-oswald">Date/Heure</TableHead>
                                        <TableHead className="text-highBlue font-oswald">Infos Supplémentaires</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {response && response.data && response.data.length > 0 ? (
                                        response.data.map((item) => (
                                            <TableRow 
                                                key={item.id} 
                                                className="hover:bg-gray-50/80 transition-colors border-b border-gray-100/80"
                                            >
                                                <TableCell className="font-medium text-gray-700">{item.id}</TableCell>
                                                <TableCell className="font-medium text-highBlue">{item.username}</TableCell>
                                                <TableCell>
                                                    <Badge className={`${getActionColor(item.action)} px-2.5 py-1 rounded-md font-medium text-xs`}>
                                                        {item.action}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{item.entityId}</TableCell>
                                                <TableCell className="font-medium">{item.entityType}</TableCell>
                                                <TableCell className="text-gray-600">{format(new Date(item.timestamp), 'yyyy-MM-dd HH:mm')}</TableCell>
                                                <TableCell>
                                                    {item.additionalInfo ? (
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                                                                    <span className="truncate max-w-[150px] mr-1">
                                                                        {item.additionalInfo.substring(0, 20)}{item.additionalInfo.length > 20 ? '...' : ''}
                                                                    </span>
                                                                    <Info className="h-3.5 w-3.5 text-highBlue" />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-md">
                                                                <DialogHeader>
                                                                    <DialogTitle className="text-highBlue font-oswald">
                                                                        Informations Détaillées
                                                                    </DialogTitle>
                                                                </DialogHeader>
                                                                <div className="p-4 bg-gray-50 rounded-md text-gray-700">
                                                                    {item.additionalInfo}
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center text-gray-500 py-12">
                                                <div className="flex flex-col items-center justify-center space-y-2">
                                                    <Info className="h-8 w-8 text-gray-300" />
                                                    <p>Aucun enregistrement trouvé</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        
                         {/* Replace current pagination with CustomPagination */}
                        {response && response.meta && (
                            <CustomPagination
                                currentPage={page}
                                totalPages={response.meta.totalPages || 0}
                                onPageChange={(newPage) => setPage(newPage)}
                                containerClassName="flex items-center justify-center mt-6 space-x-2"
                                previousButtonClassName="px-3 py-1 bg-normalGrey text-highBlue rounded-md disabled:opacity-50 font-medium"
                                nextButtonClassName="px-3 py-1 bg-normalGrey text-highBlue rounded-md disabled:opacity-50 font-medium"
                                activePageClassName="bg-highBlue text-whiteSecond"
                                inactivePageClassName="bg-normalGrey text-highBlue"
                                dotClassName="px-3 py-1 text-highBlue"
                            />
                        )}
                        
                        {/* Show item count separately */}
                        {response && response.meta && (
                            <div className="text-center mt-2 text-sm text-gray-500">
                                {response.meta.totalItems} éléments au total
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default AgentsHistoryTable;