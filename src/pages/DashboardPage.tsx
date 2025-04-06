import React, { useState, useEffect } from 'react';
import useDossierStats, { DossierStat } from '../hooks/useDashboard';
import StatusDevisDropDownUntracked from '../components/atoms/StatusDropDownUntracked';

const DashboardPage: React.FC = () => {
    const [status, setStatus] = useState('Réservé');
    const { data, isLoading } = useDossierStats(status);
    const [rows, setRows] = useState<DossierStat[]>([]);

    const handleStatusChange = (value: string) => {
        setStatus(value);
    };

    useEffect(() => {
        if (data) {
            setRows(data);
        }
    }, [data]);

    return (
        <div className=" ">
            <div className="w-full max-w-2xl bg-lightWhite rounded-md shadow-none p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-xl text-highBlue font-oswald">
                        Dossier Statut
                    </div>
                    <div className="w-40">
                        <StatusDevisDropDownUntracked value={status} onChange={handleStatusChange} />
                    </div>
                </div>
                {isLoading ? (
                    <p className="text-gray-600 text-base">Chargement...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm bg-white rounded-lg overflow-hidden">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-center font-oswald text-gray-600">
                                        Devis ID
                                    </th>
                                    <th className="px-4 py-2 text-center font-oswald text-gray-600">
                                        Client
                                    </th>
                                    <th className="px-4 py-2 text-center font-oswald text-gray-600">
                                        Créé le
                                    </th>
                                    <th className="px-4 py-2 text-center font-oswald text-gray-600">
                                        Réservé le
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-center">
                                {rows.map((item) => (
                                    <tr
                                        key={item.devisId}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                                            {item.devisId}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                                            {item.clientName}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                                            {new Date(item.createdDate).toLocaleDateString('en-GB')}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                                            {item.reservationDate
                                                ? new Date(item.reservationDate).toLocaleDateString('en-GB')
                                                : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
