import React, { useState } from 'react';

import StatusDevisDropDownUntracked from '../../../components/atoms/StatusDropDownUntracked';
import { DocumentMissingData, useDocumentMissingStats } from '../../../hooks/useDashboard';
import CustomPagination from '../../../components/atoms/CustomPagination';

// Helper function to chunk an array into pieces of given size
function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        result.push(arr.slice(i, i + chunkSize));
    }
    return result;
}

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

    return (
        <div className="w-full max-w-full bg-highGrey  rounded-md shadow-none p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="text-xl text-whiteSecond font-oswald">
                    Lead(s) pas encore fermé(s) [ {data?.meta.totalItems || 0} ]
                </div>
                <div className="w-40">
                    <StatusDevisDropDownUntracked value={status} onChange={handleStatusChange} />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-center font-oswald text-gray-600">Lead ID</th>
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
                                    <td className="px-4 py-2 text-sm text-center text-gray-900">{row.devisId}</td>
                                    <td className="px-4 py-2 text-sm text-center text-gray-900">{row.clientName}</td>
                                    <td className="px-4 py-2 text-sm text-center text-gray-900">{row.carModel}</td>
                                    <td className="px-4 py-2 text-sm text-center text-gray-900">
                                        {formatDate(row.facturationDate)}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-center text-gray-900">
                                        {row.missingDocuments.map((doc, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 mr-2 mb-2 inline-block border border-gray-300 rounded-md text-gray-700 bg-gray-50 shadow-sm hover:bg-gray-100 transition-colors"
                                            >
                                                {doc}
                                            </span>
                                        ))}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-4">
                                    No data available
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

export default DocumentMissingStats;