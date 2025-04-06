import StatusDevisDropDownUntracked from '../../../components/atoms/StatusDropDownUntracked';
import useDossierStats, { DossierStat } from '../../../hooks/useDashboard';
import React, { useState, useEffect } from 'react';


interface DossierStatsProps {
    initialStatus?: string;
}

const DossierStats: React.FC<DossierStatsProps> = ({ initialStatus = 'Réservé' }) => {
    const [status, setStatus] = useState(initialStatus);
    const { data, isLoading } = useDossierStats(status);
    const [rows, setRows] = useState<DossierStat[]>([]);

    useEffect(() => {
        if (data) {
            setRows(data);
        }
    }, [data]);

    const handleStatusChange = (value: string) => {
        setStatus(value);
    };

    return (
        <div className="w-full max-w-full bg-highBlue rounded-md shadow-none p-6">
            <div className="flex items-center justify-between mb-4">
            <div className="text-xl text-whiteSecond font-oswald">Dossier Statut</div>
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
                    <th className="px-4 py-2 text-center font-oswald text-gray-600">Devis ID</th>
                    <th className="px-4 py-2 text-center font-oswald text-gray-600">Client</th>
                    <th className="px-4 py-2 text-center font-oswald text-gray-600">Véhicule</th>
                    <th className="px-4 py-2 text-center font-oswald text-gray-600">Réservé le</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-center">
                    {rows.map((item) => (
                    <tr key={item.devisId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2 whitespace-nowrap text-gray-700">{item.devisId}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-700">{item.clientName}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-700">{item.carModel}</td>
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
    );
};

export default DossierStats;