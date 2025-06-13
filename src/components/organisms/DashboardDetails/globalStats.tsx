import { useNavigate } from 'react-router-dom';
import StatusDevisDropDownUntracked from '../../../components/atoms/StatusDropDownUntracked';
import useDossierStats, { DossierStat } from '../../../hooks/useDashboard';
import React, { useState, useEffect } from 'react';
import CustomPagination from '../../../components/atoms/CustomPagination';

interface DossierStatsProps {
    initialStatus?: string;
}

const DossierStats: React.FC<DossierStatsProps> = ({ initialStatus = 'Réservé' }) => {
    const [status, setStatus] = useState(initialStatus);
    const [page, setPage] = useState(1);
    const { data, isLoading } = useDossierStats(status, page);
    const [rows, setRows] = useState<DossierStat[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (data?.result) {
            setRows(data.result);
        }
    }, [data]);

    const handleStatusChange = (value: string) => {
        setStatus(value);
        setPage(1); // Reset to first page when status changes
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    // Render a few skeleton rows when loading
    const renderSkeletonRows = () => {
        return Array.from({ length: 3 }).map((_, index) => (
            <tr key={index} className="animate-pulse">
                <td className="px-4 py-2">
                    <div className="bg-gray-200 h-4 rounded w-full"></div>
                </td>
                <td className="px-4 py-2">
                    <div className="bg-gray-200 h-4 rounded w-full"></div>
                </td>
                <td className="px-4 py-2">
                    <div className="bg-gray-200 h-4 rounded w-full"></div>
                </td>
                <td className="px-4 py-2">
                    <div className="bg-gray-200 h-4 rounded w-full"></div>
                </td>
            </tr>
        ));
    };

    return (
        <div className="w-full max-w-full bg-white border-bgColorLight rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="text-xl text-highBlue font-oswald">Dossier Statut</div>
                <div className="w-40">
                    <StatusDevisDropDownUntracked value={status} onChange={handleStatusChange} />
                </div>
            </div>
            <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
                <table className="min-w-full text-sm overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-center font-oswald text-gray-600">Lead ID</th>
                            <th className="px-4 py-2 text-center font-oswald text-gray-600">Client</th>
                            <th className="px-4 py-2 text-center font-oswald text-gray-600">Véhicule</th>
                            <th className="px-4 py-2 text-center font-oswald text-gray-600">Réservé le</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-center">
                        {isLoading ? (
                            renderSkeletonRows()
                        ) : (
                            rows.map((item) => (
                                <tr key={item.devisId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 flex justify-center items-center">
                                        <button
                                            className="group flex items-center font-medium text-gray-700 hover:text-highBlue transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded px-2 -mx-2"
                                            onClick={() => navigate(`/carTracking?devis=${item.devisId}`)}
                                            title="Voir/modifier ce devis"
                                        >
                                            {item.devisId}
                                            <svg className="ml-1 w-4 h-4 text-gray-400 group-hover:text-highBlue transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">{item.clientName}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">{item.carModel}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                                        {item.reservationDate
                                            ? new Date(item.reservationDate).toLocaleDateString('en-GB')
                                            : 'N/A'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination Component */}
            {data && data.meta.totalPages > 1 && (
                <CustomPagination
                    currentPage={page}
                    totalPages={data.meta.totalPages}
                    onPageChange={handlePageChange}
                    containerClassName="flex items-center justify-center mt-4 space-x-2"
                    previousButtonClassName="px-3 py-1 bg-transparent text-highBlue rounded disabled:opacity-50"
                    nextButtonClassName="px-3 py-1 bg-transparent text-highBlue rounded disabled:opacity-50"
                    activePageClassName="bg-highBlue text-white"
                    inactivePageClassName="bg-transparent text-highBlue border border-gray-300 hover:bg-gray-100 transition-colors"
                    dotClassName="px-3 py-1 text-highBlue"
                />
            )}
        </div>
    );
};

export default DossierStats;