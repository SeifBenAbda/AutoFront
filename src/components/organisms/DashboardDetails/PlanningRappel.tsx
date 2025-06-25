import React, { useState, useMemo } from 'react';
import { format, differenceInDays } from 'date-fns';
import { usePlanningRappels } from '../../../hooks/useDashboard';
import CustomPagination from '../../../components/atoms/CustomPagination';
import { DatePicker } from '../../../components/atoms/DateSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../@/components/ui/select';

const PlanningRappelComponent: React.FC = () => {
    // Default date range
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const [page, setPage] = useState<number>(1);
    const [startingDate, setStartingDate] = useState<Date>(today);
    const [endingDate, setEndingDate] = useState<Date>(nextWeek);
    const [selectedCreator, setSelectedCreator] = useState<string>('all');

    const { data, isLoading, isError, error } = usePlanningRappels(page, startingDate, endingDate, selectedCreator);

    // Get unique creators for dropdown
    const creators = useMemo(() => {
        if (!data?.result?.allCreators) return [];
        return ['all', ...data.result.allCreators];
    }, [data?.result?.allCreators]);

    // Get all rappels flattened for easier rendering
    const allRappels = useMemo(() => {
        if (!data?.result?.rappelsByCreator || !data?.result?.allCreators) return [];

        return data.result.allCreators
            .filter(creator => selectedCreator === 'all' || creator === selectedCreator)
            .flatMap(creator =>
                (data.result.rappelsByCreator[creator] || []).map(rappel => ({
                    ...rappel,
                    creator
                }))
            )
            .sort((a, b) => new Date(a.rappelDate).getTime() - new Date(b.rappelDate).getTime());
    }, [data?.result, selectedCreator]);

    // Get creator-specific color
    const getCreatorColor = (creator: string) => {
        // Simple hash function to generate consistent colors for creators
        const hash = creator.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 65%)`;
    };

    return (
        <div className="w-full bg-white border-bgColorLight rounded-2xl shadow-md p-6 flex-1">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 gap-4">
                <div className="text-2xl text-highBlue font-oswald">
                    Planning des appels
                </div>

                {/* Creator filter */}
                <div className="flex items-center gap-2 ml-auto">
                    <label className="text-highBlue whitespace-nowrap">Créateur:</label>
                    <Select
                        onValueChange={(value) => setSelectedCreator(value)}
                        defaultValue={selectedCreator}
                    >
                        <SelectTrigger className="w-40 border border-normalGrey bg-normalGrey font-oswald">
                            <SelectValue placeholder="Tous les Créateurs" />
                        </SelectTrigger>
                        <SelectContent className="bg-normalGrey border-normalGrey">
                            {creators.map(creator => (
                                <SelectItem
                                    key={creator}
                                    value={creator}
                                    className="hover:bg-highGrey hover:text-whiteSecond transition-colors"
                                >
                                    {creator === 'all' ? 'Tous les Créateurs' : creator}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Date range selection */}
            <div className="flex flex-wrap gap-4 items-center mb-4 bg-white p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-gray-700 whitespace-nowrap">Du:</label>
                        <DatePicker
                            fromYear={today.getFullYear()}
                            toYear={new Date().getFullYear() + 1}
                            value={startingDate as any}
                            onChange={(date: any) => setStartingDate(date || today)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-gray-700 whitespace-nowrap">Au:</label>
                        <DatePicker
                            fromYear={new Date().getFullYear() - 5}
                            toYear={new Date().getFullYear() + 1}
                            value={endingDate as any}
                            onChange={(date: any) => setEndingDate(date || nextWeek)}
                        />
                    </div>
                </div>
            </div>

            {/* Table View */}
            <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-center font-medium text-gray-600 font-oswald">Créateur</th>
                            <th className="px-6 py-3 text-center font-medium text-gray-600 font-oswald">Lead ID</th>
                            <th className="px-6 py-3 text-center font-medium text-gray-600 font-oswald">Client</th>
                            <th className="px-6 py-3 text-center font-medium text-gray-600 font-oswald">Type de Voiture</th>
                            <th className="px-6 py-3 text-center font-medium text-gray-600 font-oswald">Date</th>
                            <th className="px-6 py-3 text-center font-medium text-gray-600 font-oswald">Délai</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isError ? (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-red-500">
                                    Erreur: {error?.message || 'Aucune donnée trouvée'}
                                </td>
                            </tr>
                        ) : isLoading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <tr key={index} className="animate-pulse">
                                    {/* Lead ID - compact */}
                                    <td className="px-6 py-4">
                                        <div className="bg-gray-200 rounded h-4 w-16"></div>
                                    </td>
                                    {/* Creator column with color dot */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="bg-gray-200 rounded-full h-3 w-3 mr-2"></div>
                                            <div className="bg-gray-200 rounded h-4 w-20"></div>
                                        </div>
                                    </td>
                                    {/* Client name - wider */}
                                    <td className="px-6 py-4">
                                        <div className="bg-gray-200 rounded h-4 w-28"></div>
                                    </td>
                                    {/* Car type - medium width */}
                                    <td className="px-6 py-4">
                                        <div className="bg-gray-200 rounded h-4 w-24"></div>
                                    </td>
                                    {/* Date - compact */}
                                    <td className="px-6 py-4">
                                        <div className="bg-gray-200 rounded h-4 w-16"></div>
                                    </td>
                                    {/* Status badge - rounded pill */}
                                    <td className="px-6 py-4">
                                        <div className="bg-gray-200 rounded-full h-5 w-20 mx-auto"></div>
                                    </td>
                                </tr>
                            ))
                        ) : allRappels.length > 0 ? (
                            allRappels.map((rappel, idx) => {
                                const rappelDate = new Date(rappel.rappelDate);
                                // Create date objects with time set to midnight to compare dates only
                                const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                                const rappelDateOnly = new Date(rappelDate.getFullYear(), rappelDate.getMonth(), rappelDate.getDate());
                                const days = differenceInDays(rappelDateOnly, todayDateOnly);
                                let statusText = "";
                                let statusClass = "";
                                const isRappelHasContent = rappel.rappelContent && rappel.rappelContent.trim() !== "";
                                if (isRappelHasContent) {
                                    statusText = "Rappel prévu";
                                    statusClass = "text-blue-600 bg-blue-50";
                                } else {
                                    if (days < 0) {
                                        statusText = "En retard";
                                        statusClass = "text-red-600 bg-red-50";
                                    } else if (days === 0) {
                                        statusText = "Aujourd'hui";
                                        statusClass = "text-orange-600 bg-orange-50";
                                    } else if (days === 1) {
                                        statusText = "Demain";
                                        statusClass = "text-yellow-600 bg-yellow-50";
                                    } else if (days <= 3) {
                                        statusText = `Dans ${days} jours`;
                                        statusClass = "text-yellow-600 bg-yellow-50";
                                    } else {
                                        statusText = `Dans ${days} jours`;
                                        statusClass = "text-green-600 bg-green-50";
                                    }
                                }
                                
                                // Create short versions for small screens
                                const shortStatusText = isRappelHasContent ? "Prévu" : 
                                    days < 0 ? "Retard" : 
                                    days === 0 ? "Aujourd'hui" : 
                                    days === 1 ? "Demain" : 
                                    `+${days}j`;

                                return (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span
                                                className="inline-block w-3 h-3 rounded-full mr-2"
                                                style={{ backgroundColor: getCreatorColor(rappel.creator) }}
                                            ></span>
                                            {rappel.creator}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-center">
                                            <button
                                                className="text-highBlue hover:underline"
                                                onClick={() => window.open(`/carTracking?devis=${rappel.devisId}`, '_blank')}
                                            >
                                                {rappel.devisId}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-center">{rappel.clientName}</td>
                                        <td className="px-6 py-4 text-center">{rappel.carType}</td>
                                        <td className="px-6 py-4 text-center">{format(rappelDate, 'dd/MM/yyyy')}</td>
                                        <td className="px-6 py-4 align-middle text-center">
                                            <span className={`px-3 py-2 rounded-md font-oswald text-xs ${statusClass}`}>
                                                {shortStatusText}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-6 text-gray-500">
                                    Aucun appel trouvé pour cette période
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4">
                <CustomPagination
                    currentPage={page}
                    totalPages={data?.meta.totalPages || 0}
                    onPageChange={(newPage) => setPage(newPage)}
                    containerClassName="flex items-center justify-center mt-4 space-x-2"
                    previousButtonClassName="px-3 py-1 bg-transparent text-highBlue rounded disabled:opacity-50"
                    nextButtonClassName="px-3 py-1 bg-transparent text-highBlue rounded disabled:opacity-50"
                    activePageClassName="bg-highBlue text-white"
                    inactivePageClassName="bg-transparent text-highBlue border border-gray-300 hover:bg-gray-100 transition-colors"
                    dotClassName="px-3 py-1 text-highBlue"
                />
            </div>
        </div>
    );
};

export default PlanningRappelComponent;
