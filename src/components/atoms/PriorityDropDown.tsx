import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../@/components/ui/select";


interface PriorityDevisTypes {
    value?: string; // Updated to match the value type used in ClientTypeSelect
    onChange: (value: string) => void; // Callback now expects a string
    isFiltring : boolean;
}

const PriorityDevisDropDown = ({ value, onChange, isFiltring }: PriorityDevisTypes) => {
    return (
        <Select onValueChange={onChange}>
            <SelectTrigger className="w-full border border-bluePrimary">
                <SelectValue placeholder={value ? value.toString() : "Toutes les priorités"} />
            </SelectTrigger>
            <SelectContent>
                {isFiltring && (
                    <SelectItem key="Toutes les priorités" value="Toutes les priorités">
                        Toutes les priorités
                    </SelectItem>
                )}
                <SelectItem key="Normale" value="Normale">Normale</SelectItem>
                <SelectItem value="Moyenne">Moyenne</SelectItem>
                <SelectItem value="Haute">Haute</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default PriorityDevisDropDown;
