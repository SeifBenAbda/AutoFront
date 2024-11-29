import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../@/components/ui/select";

interface StatusDevisTypes {
    value?: string;
    onChange: (value: string) => void;
    isFiltring?: boolean; // Optional prop to control whether "Tous Statuts" is shown
}

const StatusDevisDropDown = ({ value, onChange, isFiltring }: StatusDevisTypes) => {
    const hoverItem = "cursor-pointer focus:bg-lightWhite hover:rounded-md";
    return (
        <Select onValueChange={onChange}>
            <SelectTrigger className={`w-full border border-normalGrey bg-normalGrey font-oswald`}>
                <SelectValue placeholder={value ? value?.toString() : "Tous Status"} className={hoverItem}/>
            </SelectTrigger>
            <SelectContent className="bg-normalGrey border-normalGrey">
                {isFiltring && (
                    <SelectItem key="Tous Status" value="Tous Status" className={hoverItem}>
                        Tous Status
                    </SelectItem>
                )}
                <SelectItem key="En Attente" value="En Attente" className={hoverItem}>En Attente</SelectItem>
                <SelectItem key="En Cours" value="En Cours" className={hoverItem}>En Cours</SelectItem>
                <SelectItem key="Réservé" value="Réservé" className={hoverItem}>Réservé</SelectItem>
                <SelectItem key="HDSI" value="HDSI" className={hoverItem}>HDSI</SelectItem>
                <SelectItem key="Facturé" value="Facturé" className={hoverItem}>Facturé</SelectItem>
                <SelectItem key="Annuler" value="Annuler" className={hoverItem}>Annuler</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default StatusDevisDropDown;
