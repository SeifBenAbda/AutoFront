import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../@/components/ui/select";
import { useRef } from "react";

interface StatusDevisTypes {
    value?: string;
    onChange: (value: string) => void;
    isFiltring?: boolean; // Optional prop to control whether "Tous Statuts" is shown
}

const StatusDevisDropDownUntracked = ({ value, onChange, isFiltring }: StatusDevisTypes) => {
    const hoverItem = "cursor-pointer focus:bg-lightWhite hover:rounded-md";
    // Keep track of the initial value
    const initialValueRef = useRef<string | undefined>(value);
    
    // Function to get available status options based on INITIAL value regardless of current value
    const getAvailableStatusOptions = () => {
        if (isFiltring) {
            // Show all options in filtering mode
            return [
                { key: "Tous Status", value: "Tous Status" },
                { key: "En Cours", value: "En Cours" },
                { key: "Réservé", value: "Réservé" },
                { key: "HDSI", value: "HDSI" },
                { key: "Facturé", value: "Facturé" },
                { key: "Livré", value: "Livré" },
                { key: "Annulé", value: "Annulé" },
            ];
        }
        
        // Always base options on the initial value, not the current value
        switch (initialValueRef.current) {
            default:
                // Default options for other initial statuses
                return [
                   
                    { key: "Réservé", value: "Réservé" },
                    { key: "HDSI", value: "HDSI" },
                    { key: "Facturé", value: "Facturé" },
                ];
        }
    };
    
    const isDisabled = initialValueRef.current === "Annulé" && !isFiltring;
    const statusOptions = getAvailableStatusOptions();
    
    return (
        <Select onValueChange={onChange} disabled={isDisabled}>
            <SelectTrigger className={`w-full border border-normalGrey bg-normalGrey font-oswald ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
                <SelectValue placeholder={value ? value?.toString() : "Tous Status"} className={hoverItem}/>
            </SelectTrigger>
            <SelectContent className="bg-normalGrey border-normalGrey">
                {statusOptions.map(option => (
                    <SelectItem 
                        key={option.key} 
                        value={option.value} 
                        className={hoverItem}
                    >
                        {option.key}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default StatusDevisDropDownUntracked;
