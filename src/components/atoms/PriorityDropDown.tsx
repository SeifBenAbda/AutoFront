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
            <SelectTrigger className="w-full border border-highGrey bg-lightWhite text-highGrey hover:text-highGrey">
                <SelectValue placeholder={value ? value.toString() : "Toutes les priorités"} />
            </SelectTrigger>
            <SelectContent className="hover:text-highGrey">
                {isFiltring && (
                    <SelectItem key="Toutes les priorités" value="Toutes les priorités">
                        Toutes les priorités
                    </SelectItem>
                )}
                <SelectItem key="Normale" value="Normale" className="text-highGrey hover:text-highGrey">Normale</SelectItem>
                <SelectItem value="Moyenne" className="text-highGrey hover:text-highGrey">Moyenne</SelectItem>
                <SelectItem value="Haute" className="text-highGrey hover:text-highGrey">Haute</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default PriorityDevisDropDown;
