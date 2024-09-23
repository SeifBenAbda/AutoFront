import { Devis } from "../../types/devisTypes";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale"; // Import French locale
import { Car, Phone, User } from "lucide-react";

interface MiniDevisCardContentProps {
    devis: Devis;
    isSelected: boolean;
}

export default function MiniDevisCardContent({ devis, isSelected }: MiniDevisCardContentProps) {
    // Calculate the difference between the creation date and now
    const creationDate = new Date(devis.DateCreation!); // Assuming `devis.creationDate` is a valid date string
    const daysAgo = formatDistance(creationDate, new Date(), { addSuffix: true, locale: fr });
    const selectedTextColor = isSelected ? "text-highGrey" : "text-whiteSecond"
    const selectedBackground = isSelected ? "bg-highGrey" : "bg-whiteSecond"
    const selectedBorderColor = isSelected ? "border-highGrey" : "border-whiteSecond"

    const getPriorityClassName = (devisPriority: string) => {
        switch (devisPriority) {
            case "Normale":
                return "bg-whiteSecond border border-whiteSecond text-highGrey"
            case "Moyenne":
                return "bg-yellow-400 border border-yellow-400 text-highGrey"
            case "Haute":
                return "bg-red-500 border border-red-500 text-lightWhite"

        }
    }

    const getStatusClassName = (devisStatus: string) => {
        switch (devisStatus) {
            case "En Attente":
                return "bg-gray-300 border border-gray-300 text-highGrey"
            case "En Cours":
                return "bg-yellow-200 border border-yellow-200 text-highGrey"
            case "Facture":
                return isSelected ? "bg-highGreen border border-highGreen text-lightWhite" : "bg-green-200 border border-green-200 text-highGrey"
            case "Reserver":
                return "bg-blue-300 border border-blue-300 text-highGrey"
            case "Annuler":
                return "bg-red-500 border border-red-500 text-lightWhite"
                case "HDSI":
                    return "bg-yellow-400 border border-yellow-400 text-highGrey"    
            default:
                return ""
        }
    }

    return (
        <div>
            <div className="flex justify-between">
                {/* Client name */}
                <div className="flex flex-row space-x-2">
                    <User size={20} />
                    <h2 className="text-base">{devis.client!.nomClient}</h2>
                </div>

                {/* Days ago in French */}
                <span className={`text-sm ${selectedTextColor} `}>{`Il y a ${daysAgo}`}</span>
            </div>

            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row space-x-2 ">
                    <Phone size={20} />
                    <span className={`text-base ${selectedTextColor}`}>Tel : {devis.client?.telClient}</span>
                </div>
                <div className={`text-sm font-oswald rounded-md pr-2 pl-2 pt-1 pb-1 m-1 ${getPriorityClassName(devis.PriorityDevis)}`}>
                    <span>Priorité {devis.PriorityDevis}</span>
                </div>
            </div>

            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row space-x-2 ">
                    <Car size={20} />
                    <span className={`text-base ${selectedTextColor}`}> : {devis.carRequests[0]?.CarModel}</span>
                </div>
                <div className={`text-sm font-oswald rounded-md pr-2 pl-2 pt-1 pb-1 m-1 ${getStatusClassName(devis.StatusDevis!)}`}>
                    <span>{devis.StatusDevis}</span>
                </div>
            </div>

        </div>
    );
}
