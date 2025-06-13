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
    isFiltring: boolean;
}

const PriorityDevisDropDown = ({ value, onChange, isFiltring }: PriorityDevisTypes) => {
    const hoverItem = "cursor-pointer focus:bg-lightWhite hover:rounded-md";
    return (
        <Select onValueChange={onChange}>
            <SelectTrigger className="w-full border border-normalGrey bg-normalGrey font-oswald text-highBlue">
                <SelectValue placeholder={value ? value.toString() : "Toutes les priorités"} className={hoverItem} />
            </SelectTrigger>
            <SelectContent className="bg-normalGrey border-normalGrey">
                {isFiltring && (
                    <SelectItem key="Toutes les priorités" value="Toutes les priorités" className={hoverItem}>
                        Toutes les priorités
                    </SelectItem>
                )}
                <SelectItem key="Normale" value="Normale" className={hoverItem}>Normale</SelectItem>
                <SelectItem key="Moyenne" value="Moyenne" className={hoverItem}>Moyenne</SelectItem>
                <SelectItem key="Haute" value="Haute" className={hoverItem}>Haute</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default PriorityDevisDropDown;
