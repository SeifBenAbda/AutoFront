import React, { useState } from 'react';
import CustomPagination from '../../../components/atoms/CustomPagination';
import { DatePicker } from '../../../components/atoms/DateSelector';
import { useConversionStats } from '../../../hooks/useDashboard';

const ConversionStats: React.FC = () => {
    // Default date range
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);

    const [page, setPage] = useState<number>(1);
    const [startingDate, setStartingDate] = useState<Date>(lastMonth);
    const [endingDate, setEndingDate] = useState<Date>(today);

    const { data, isLoading, isError } = useConversionStats(page, startingDate, endingDate);

    return (
        <div className="w-full max-w-full bg-highGrey rounded-md shadow-md p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div className="text-2xl text-whiteSecond font-oswald">
                    Statistiques de Conversion
                </div>
            </div>
            
            {/* Date range selection */}
            <div className="flex flex-wrap gap-4 items-center mb-4 bg-white p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-gray-700 whitespace-nowrap">De:</label>
                        <DatePicker
                            fromYear={new Date().getFullYear() - 5}
                            toYear={new Date().getFullYear() + 1}
                            value={startingDate as any}
                            onChange={(date: any) => setStartingDate(date || lastMonth)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-gray-700 whitespace-nowrap">À:</label>
                        <DatePicker
                            fromYear={new Date().getFullYear() - 5}
                            toYear={new Date().getFullYear() + 1}
                            value={endingDate as any}
                            onChange={(date: any) => setEndingDate(date || today)}
                        />
                    </div>
                </div>
            </div>

            {/* Enhanced table */}
            <div className="overflow-x-auto bg-white rounded-lg">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-center font-medium text-gray-600 font-oswald">Créateur</th>
                            <th className="px-6 py-3 text-center font-medium text-gray-600 font-oswald">Nombre de Devis</th>
                            <th className="px-6 py-3 text-center font-medium text-gray-600 font-oswald">Nombre de Rappels</th>
                            <th className="px-6 py-3 text-center font-medium text-gray-600 font-oswald">Devis en Cours</th>
                            <th className="px-6 py-3 text-center font-medium text-gray-600 font-oswald">Réservations</th>
                            <th className="px-6 py-3 text-center font-medium text-gray-600 font-oswald">HDSI</th>
                            <th className="px-6 py-3 text-center font-medium text-gray-600 font-oswald">Factures</th>
                            <th className="px-6 py-3 text-center font-medium text-gray-600 font-oswald">Livrés</th>
                            <th className="px-6 py-3 text-center font-medium text-gray-600 font-oswald">Annulés</th>
                            <th className="px-6 py-3 text-center font-medium text-gray-600 font-oswald">Taux de Conversion</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isError ? (
                            <tr>
                                <td colSpan={10} className="text-center py-4 text-red-500">
                                    Erreur lors du chargement des statistiques de conversion
                                </td>
                            </tr>
                        ) : isLoading ? (
                            // Skeleton loading state
                            Array.from({ length: 5 }).map((_, index) => (
                                <tr key={index} className="animate-pulse">
                                    {Array.from({ length: 10 }).map((__, cellIndex) => (
                                        <td key={cellIndex} className="px-6 py-4">
                                            <div className="bg-gray-200 rounded h-4 w-28"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : data?.result?.creators?.length ? (
                            data.result.creators.map((creator, idx) => {
                                // Generate a consistent color for each creator
                                const hash = creator.creator.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                                const hue = hash % 360;
                                const creatorColor = `hsl(${hue}, 70%, 65%)`;
                                
                                return (
                                    <tr key={creator.creator || idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className="inline-block w-3 h-3 rounded-full mr-2 align-middle"
                                                style={{ backgroundColor: creatorColor }}
                                            ></span>
                                            {creator.creator}
                                        </td>
                                        <td className="px-6 py-4 text-center">{creator.totalDevis}</td>
                                        <td className="px-6 py-4 text-center">{creator.rappelsCount}</td>
                                        <td className="px-6 py-4 text-center">{creator.enCoursCount}</td>
                                        <td className="px-6 py-4 text-center">{creator.reserveCount}</td>
                                        <td className="px-6 py-4 text-center">{creator.hdsiCount}</td>
                                        <td className="px-6 py-4 text-center">{creator.factureCount}</td>
                                        <td className="px-6 py-4 text-center">{creator.livreCount}</td>
                                        <td className="px-6 py-4 text-center">{creator.annuleCount}</td>
                                        <td className="px-6 py-4 text-center">{creator.tauxConversion}%</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={10} className="text-center py-6 text-gray-500">
                                    Aucune donnée de conversion disponible
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
                    totalPages={data?.meta?.totalPages || 0}
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

export default ConversionStats;