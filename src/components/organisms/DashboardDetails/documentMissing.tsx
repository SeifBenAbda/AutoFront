import React, { useState } from 'react';

import StatusDevisDropDownUntracked from '../../../components/atoms/StatusDropDownUntracked';
import { DocumentMissingData, useDocumentMissingStats } from '../../../hooks/useDashboard';
import CustomPagination from '../../../components/atoms/CustomPagination';
import { useNavigate } from 'react-router-dom';


// Helper function to format a date as dd/MM/yyyy
function formatDate(date: string | Date): string {
    if (date) {
        const d = new Date(date);
        return d.toLocaleDateString("en-GB");
    }
    return 'N/A';
}

const DocumentMissingStats: React.FC = () => {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('Réservé');

    const { data, isLoading, isError, error } = useDocumentMissingStats(page, status);

    const handleStatusChange = (value: string) => {
        setStatus(value);
        setPage(1); // Reset page number on status change
    };

    const navigate = useNavigate();

    return (
        <div className="w-full max-w-full bg-white border-bgColorLight rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="text-2xl text-highBlue font-oswald">
                    Dossier(s) pas encore fermé(s) [ {data?.meta.totalItems || 0} ]
                </div>
                <div className="w-40">
                    <StatusDevisDropDownUntracked value={status} onChange={handleStatusChange} />
                </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                <table className="min-w-full text-sm overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-center font-oswald text-gray-600">Dossier ID</th>
                            <th className="px-4 py-2 text-center font-oswald text-gray-600">Client</th>
                            <th className="px-4 py-2 text-center font-oswald text-gray-600">Véhicule</th>
                            <th className="px-4 py-2 text-center font-oswald text-gray-600">Date Facturation</th>
                            <th className="px-4 py-2 text-center font-oswald text-gray-600">Documents manquants</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isError ? (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-red-500">
                                    Error: {error?.message || 'No Data Found'}
                                </td>
                            </tr>
                        ) : isLoading || !data ? (
                            // Show skeleton rows when loading
                            Array.from({ length: 5 }).map((_, index) => (
                                <tr key={index} className="animate-pulse">
                                    {Array.from({ length: 5 }).map((__, cellIndex) => (
                                        <td key={cellIndex} className="px-4 py-2 text-center">
                                            <div className="bg-gray-200 rounded h-4 mx-auto" style={{ width: cellIndex === 3 ? '80px' : '100px' }} />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : data.result.length > 0 ? (
                            data.result.map((row: DocumentMissingData) => (
                                <tr key={row.devisId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 flex justify-center items-center ">
                                        <button
                                            className="group flex items-center font-medium text-gray-700 hover:text-highBlue transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded px-2 -mx-2"
                                            onClick={() => navigate(`/carTracking?devis=${row.devisId}`)}
                                            title="Voir/modifier ce Dossier"
                                        >
                                            {row.devisId}
                                            <svg className="ml-1 w-4 h-4 text-gray-400 group-hover:text-highBlue transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 text-sm text-center text-gray-900">{row.clientName}</td>
                                    <td className="px-4 py-2 text-sm text-center text-gray-900">{row.carModel}</td>
                                    <td className="px-4 py-2 text-sm text-center text-gray-900">
                                        {formatDate(row.facturationDate)}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-center text-gray-900">
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {row.missingDocuments.map((doc, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 text-xs font-medium shadow-sm 
                                                    hover:bg-gray-500 hover:text-white transition-colors cursor-pointer"
                                                >
                                                    <svg
                                                        className="w-4 h-4 text-yellow-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                    {doc}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-4">
                                    Aucune donnée disponible
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
                previousButtonClassName="px-3 py-1 bg-transparent text-highBlue rounded disabled:opacity-50"
                nextButtonClassName="px-3 py-1 bg-transparent text-highBlue rounded disabled:opacity-50"
                activePageClassName="bg-highBlue text-white"
                inactivePageClassName="bg-transparent text-highBlue border border-gray-300 hover:bg-gray-100 transition-colors"
                dotClassName="px-3 py-1 text-highBlue"
            />
        </div>
    );
};

export default DocumentMissingStats;