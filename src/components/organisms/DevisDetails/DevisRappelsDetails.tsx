import { Devis, Rappel } from "../../../types/devisTypes";
import AudioRecorder from "./DevisAudioSystem";
import { Textarea } from "../../../@/components/ui/textarea";
import { DatePicker } from "../../atoms/DateSelector";
import { useUser } from "../../../context/userContext";

interface DevisRappelsDetailsProps {
    devisId: number,
    rappels: Rappel[];
    devis: Devis;
    onUpdateDevis: (updatedDevis: Devis) => void;
    onUpdate: (updatedRappels: Rappel[]) => void;
}

export function DevisRappelsDetails({ devisId, rappels, devis, onUpdateDevis, onUpdate }: DevisRappelsDetailsProps) {
    const { user } = useUser();
    const isEditingOpen = devis.StatusDevis == "En Cours" || devis.devisFacture==null;
    const handleChange = (rappelId: number, field: keyof Rappel, value: string | Date | boolean | undefined) => {
        const index = rappels.findIndex(rappel => rappel.RappelId === rappelId);

        if (index === -1) return;

        const updatedRappels = [...rappels];
        updatedRappels[index] = {
            ...updatedRappels[index],
            [field]: value,
            UpdatedBy: user?.username || "Unknown",
            UpdatedAt: new Date()
        };

        onUpdate(updatedRappels);
    };


    const handleCommentsChange = (comments: string): void => {
        const updateDevis = { ...devis, Comments: comments };
        onUpdateDevis(updateDevis);
    };

    const handleDateChange = (rappelId: number, date: Date | undefined) => {
        handleChange(rappelId, "RappelDate", date);
    };

    const handleToggleClosed = (rappelId: number, currentStatus: boolean | undefined) => {
        handleChange(rappelId, "isClosed", !currentStatus);
    };

    const handleAddRappel = () => {
        if (isEditingOpen) {
            const newRappel: Rappel = {
                RappelId: Date.now(), // Use a unique ID for the new rappel
                RappelDate: new Date(),
                RappelContent: "",
                isClosed: false,
                CreatedBy: user?.username || "Unknown",
                CreatedAt: new Date(),
                UpdatedBy: user?.username || "Unknown",
                UpdatedAt: new Date()
            };
            onUpdate([...rappels, newRappel]);
        }
    };

    return (
        <div className="flex flex-col pl-2 pr-2 pt-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Modern Custom Table Header */}
                <div className="bg-gradient-to-r from-highBlue to-blue-800 text-white py-4 px-6 flex justify-between items-center">
                    <h3 className="text-lg font-oswald">Liste des Rappels</h3>
                    <button
                        onClick={handleAddRappel}
                        className="bg-white text-highBlue px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-transparent"
                    >
                        Nouvel Rappel
                    </button>
                </div>

                {/* Custom Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-oswald text-sm text-gray-600 uppercase tracking-wider w-[5%]">N°</th>
                                <th className="text-left py-3 px-4 font-oswald text-sm text-gray-600 uppercase tracking-wider w-[20%]">Date</th>
                                <th className="text-left py-3 px-4 font-oswald text-sm text-gray-600 uppercase tracking-wider w-[55%]">Contenu</th>
                                {user?.role === 'ADMIN' && (
                                    <th className="text-left py-3 px-4 font-oswald text-sm text-gray-600 uppercase tracking-wider w-[20%]">Statut</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {rappels.map((rappel, index) => (
                                <tr
                                    key={rappel.RappelId}
                                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 ease-in-out ${rappel.isClosed ? "bg-gray-50 text-gray-500" : "bg-white"
                                        }`}
                                >
                                    <td className="py-3 px-4 align-middle">
                                        <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-100 text-blue-800 font-medium text-sm">
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 align-middle">
                                        {rappel.isClosed && isEditingOpen ? (
                                            <div className="text-sm">{new Date(rappel.RappelDate!).toLocaleDateString()}</div>
                                        ) : (
                                            <div className="w-40">
                                                <DatePicker
                                                    value={rappel.RappelDate}
                                                    onChange={(date) => handleDateChange(rappel.RappelId!, date)}
                                                    fromYear={new Date().getFullYear()}
                                                    toYear={new Date().getFullYear() + 1}
                                                />
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 align-middle">
                                        {rappel.isClosed || !isEditingOpen ? (
                                            <div className="text-sm whitespace-pre-wrap max-h-20 overflow-y-auto">
                                                {rappel.RappelContent || ""}
                                            </div>
                                        ) : (
                                            <Textarea
                                                value={rappel.RappelContent || ""}
                                                onChange={(e) => handleChange(rappel.RappelId!, "RappelContent", e.target.value)}
                                                className="text-sm resize-none h-16 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md"
                                                placeholder="Saisir le contenu du rappel..."
                                            />
                                        )}
                                    </td>
                                    {user?.role === 'ADMIN' && (
                                        <td className="py-3 px-4 align-middle">
                                            <button
                                                onClick={() => handleToggleClosed(rappel.RappelId!, rappel.isClosed)}
                                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${rappel.isClosed
                                                        ? "bg-white text-highBlue border border-highBlue hover:bg-blue-50 focus:ring-transparent"
                                                        : "bg-highBlue text-white hover:bg-blue-700 focus:ring-transparent"
                                                    }`}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>{rappel.isClosed ? "Réouvrir" : "Clôturer"}</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        {rappel.isClosed ? (
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        ) : (
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        )}
                                                    </svg>
                                                </div>
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {rappels.length === 0 && (
                                <tr>
                                    <td colSpan={user?.role === 'ADMIN' ? 4 : 3} className="py-8 text-center text-gray-500">
                                        Aucun rappel trouvé
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <hr className="bg-highBlue mt-4 mb-1 mr-2 ml-2" />



            <div className="mt-2 mb-2 bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-highBlue to-blue-800 text-white py-4 px-6">
                    <h3 className="text-lg font-oswald">Commentaires Additionnels</h3>
                </div>

                {/* Content */}
                <div className="p-4">
                    {isEditingOpen ? (
                        <Textarea
                            className="w-full text-sm resize-none border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md"
                            placeholder="Saisir des commentaires supplémentaires..."
                            rows={4}
                            onChange={(e) => handleCommentsChange(e.target.value)} // Update devis comments
                            value={devis.Comments || ""}
                        />
                    ) : (
                        <div className="text-sm text-gray-600 whitespace-pre-wrap">
                            {devis.Comments || "Aucun commentaire ajouté."}
                        </div>
                    )}
                </div>
            </div>
            {isEditingOpen && (
                <div className="pl-2">
                    <AudioRecorder devisId={devisId} />
                </div>
            )}
        </div>
    );
}