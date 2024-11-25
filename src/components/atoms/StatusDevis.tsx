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
    return (
        <Select onValueChange={onChange}>
            <SelectTrigger className="w-full border border-highGrey2">
                <SelectValue placeholder={value ? value?.toString() : "Tous Status"} />
            </SelectTrigger>
            <SelectContent>
                {isFiltring && (
                    <SelectItem key="Tous Status" value="Tous Status">
                        Tous Status
                    </SelectItem>
                )}
                <SelectItem key="En Attente" value="En Attente">En Attente</SelectItem>
                <SelectItem key="En Cours" value="En Cours">En Cours</SelectItem>
                <SelectItem key="Réservé" value="Réservé">Réservé</SelectItem>
                <SelectItem key="HDSI" value="HDSI">HDSI</SelectItem>
                <SelectItem key="Facturé" value="Facturé">Facturé</SelectItem>
                <SelectItem key="Annuler" value="Annuler">Annuler</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default StatusDevisDropDown;
