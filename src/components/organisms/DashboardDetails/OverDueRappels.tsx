import React, { useState, useMemo } from 'react';
import { format, differenceInDays } from 'date-fns';
import { PlanningRappelData, useOverDueRappels } from '../../../hooks/useDashboard';
import CustomPagination from '../../../components/atoms/CustomPagination';
import { DatePicker } from '../../../components/atoms/DateSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../@/components/ui/select';
import { Badge } from '../../../@/components/ui/badge';

const OverDueRappels: React.FC = () => {
    // Default date range
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const [page, setPage] = useState<number>(1);
    const [startingDate, setStartingDate] = useState<Date>(today);
    const [endingDate, setEndingDate] = useState<Date>(nextWeek);
    const [selectedCreator, setSelectedCreator] = useState<string>('all');

    const { data, isLoading, isError, error } = useOverDueRappels(page, startingDate, endingDate, selectedCreator);

    // Get unique creators for dropdown
    const creators = useMemo(() => {
        if (!data?.result?.allCreators) return [];
        return ['all', ...data.result.allCreators];
    }, [data?.result?.allCreators]);

    // Get all rappels flattened for easier rendering (using same approach as PlanningRappel)
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

    // Get creator-specific color (for consistent visual treatment)
    const getCreatorColor = (creator: string) => {
        // Simple hash function to generate consistent colors for creators
        const hash = creator.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 65%)`;
    };

    // Helper to get delay status text and class
    const getDelayStatus = (date: string | Date) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const days = differenceInDays(dateObj, today);
        
        if (days < -7) return { text: `En retard de ${Math.abs(days)} jours`, class: "text-red-600 bg-red-50" };
        if (days < -3) return { text: `Retard important`, class: "text-red-600 bg-red-50" };
        if (days < 0) return { text: "En retard", class: "text-red-600 bg-red-50" };
        if (days === 0) return { text: "Aujourd'hui", class: "text-orange-600 bg-orange-50" };
        return { text: `Dans ${days} jours`, class: "text-yellow-600 bg-yellow-50" };
    };

    return (
        <div className="w-full max-w-full bg-highGrey rounded-md shadow-md p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div className="text-2xl text-whiteSecond font-oswald">
                    Rappels en retard
                </div>
                
                {/* Creator filter - matches PlanningRappel styling */}
                <div className="flex items-center gap-2 ml-auto">
                    <label className="text-whiteSecond whitespace-nowrap">Créateur:</label>
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
            
            {/* Date range selection - styled like table view in PlanningRappel */}
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

            {/* Enhanced table with styling matching PlanningRappel */}
            <div className="overflow-x-auto bg-white rounded-lg">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium text-gray-600 font-oswald">Créateur</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-600 font-oswald">Client</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-600 font-oswald">Type de Voiture</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-600 font-oswald">Date</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-600 font-oswald">Statut</th>
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
                            // Enhanced skeleton loading state
                            Array.from({ length: 5 }).map((_, index) => (
                                <tr key={index} className="animate-pulse">
                                    {Array.from({ length: 5 }).map((__, cellIndex) => (
                                        <td key={cellIndex} className="px-6 py-4">
                                            <div className="bg-gray-200 rounded h-4 w-28"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : allRappels.length > 0 ? (
                            allRappels.map((rappel, idx) => {
                                const rappelDate = new Date(rappel.rappelDate);
                                const delayStatus = getDelayStatus(rappelDate);
                                const creatorColor = getCreatorColor(rappel.creator);
                                
                                return (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span
                                                className="inline-block w-3 h-3 rounded-full mr-2"
                                                style={{ backgroundColor: creatorColor }}
                                            ></span>
                                            {rappel.creator}
                                        </td>
                                        <td className="px-6 py-4 font-medium">{rappel.clientName}</td>
                                        <td className="px-6 py-4">{rappel.carType}</td>
                                        <td className="px-6 py-4">{format(rappelDate, 'dd/MM/yyyy')}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${delayStatus.class}`}>
                                                {delayStatus.text}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-6 text-gray-500">
                                    Aucun rappel en retard trouvé pour cette période
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination - styled to match PlanningRappel */}
            <div className="mt-4">
                <CustomPagination
                    currentPage={page}
                    totalPages={data?.meta.totalPages || 0}
                    onPageChange={(newPage) => setPage(newPage)}
                    containerClassName="flex items-center justify-center mt-4 space-x-2"
                    previousButtonClassName="px-3 py-1 bg-transparent text-whiteSecond rounded disabled:opacity-50"
                    nextButtonClassName="px-3 py-1 bg-transparent text-whiteSecond rounded disabled:opacity-50"
                    activePageClassName="bg-whiteSecond text-highBlue"
                    inactivePageClassName="bg-transparent text-gray-200"
                    dotClassName="px-3 py-1 text-whiteSecond"
                />
            </div>
        </div>
    );
};

export default OverDueRappels;
