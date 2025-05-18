import React, { useState, useMemo } from 'react';

import { format } from 'date-fns';
import { PlanningRappelData, useOverDueRappels } from '../../../hooks/useDashboard';
import CustomPagination from '../../../components/atoms/CustomPagination';
import { DatePicker } from '../../../components/atoms/DateSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../@/components/ui/select';

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

    return (
        <div className="w-full max-w-full bg-highGrey rounded-md shadow-none p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="text-xl text-whiteSecond font-oswald">
                    Rappels en retard
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <label className="text-whiteSecond">Du:</label>
                        <DatePicker
                            fromYear={today.getFullYear()}
                            toYear={new Date().getFullYear() + 1}
                            value={startingDate as any}
                            onChange={(date: any) => setStartingDate(date || today)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-whiteSecond">Au:</label>
                        <DatePicker
                            fromYear={new Date().getFullYear() - 5}
                            toYear={new Date().getFullYear() + 1}
                            value={endingDate as any}
                            onChange={(date: any) => setEndingDate(date || nextWeek)}
                        />
                    </div>
                </div>
            </div>

            {/* Creator Filter Dropdown */}
            <div className="mb-4 flex justify-end">
                <div className="flex items-center gap-2">
                    <label className="text-whiteSecond">Filtrer par Créateur:</label>
                    <Select 
                        onValueChange={(value) => setSelectedCreator(value)} 
                        defaultValue={selectedCreator}
                    >
                        <SelectTrigger className="w-full border border-normalGrey bg-normalGrey font-oswald">
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

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-center font-oswald text-gray-600">Créateur</th>
                            <th className="px-4 py-2 text-center font-oswald text-gray-600">Client</th>
                            <th className="px-4 py-2 text-center font-oswald text-gray-600">Type de Voiture</th>
                            <th className="px-4 py-2 text-center font-oswald text-gray-600">Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isError ? (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-red-500">
                                    Erreur: {error?.message || 'Aucune donnée trouvée'}
                                </td>
                            </tr>
                        ) : isLoading || !data ? (
                            // Skeleton loading state
                            Array.from({ length: 5 }).map((_, index) => (
                                <tr key={index} className="animate-pulse">
                                    {Array.from({ length: 4 }).map((__, cellIndex) => (
                                        <td key={cellIndex} className="px-4 py-2 text-center">
                                            <div className="bg-gray-200 rounded h-4 mx-auto" style={{ width: '100px' }} />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : data.result && data.result.allCreators && data.result.rappelsByCreator ? (
                            // Use the single object structure directly and filter by creator if needed
                            data.result.allCreators
                                .filter(creator => selectedCreator === 'all' || creator === selectedCreator)
                                .map(creator =>
                                    data.result.rappelsByCreator[creator] &&
                                        Array.isArray(data.result.rappelsByCreator[creator]) ?
                                        data.result.rappelsByCreator[creator].map((rappel, idx) => (
                                            <tr key={`${creator}-${idx}`} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-2 text-sm text-center text-gray-900">{creator}</td>
                                                <td className="px-4 py-2 text-sm text-center text-gray-900">
                                                    {rappel.clientName}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-center text-gray-900">
                                                    {rappel.carType}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-center text-gray-900">
                                                    {format(new Date(rappel.rappelDate), 'dd/MM/yyyy')}
                                                </td>
                                            </tr>
                                        )) : null
                                )
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-4">
                                    Aucune donnée disponible (Structure des données: {JSON.stringify(data)})
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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
    );
};

export default OverDueRappels;
