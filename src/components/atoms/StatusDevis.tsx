import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../@/components/ui/select";


interface StatusDevisTypes {
    value?: string; // Updated to match the value type used in ClientTypeSelect
    onChange: (value: string) => void; // Callback now expects a string
}

const StatusDevisDropDown = ({ value, onChange }: StatusDevisTypes) => {
    console.log(value)
    return (
       
        <Select onValueChange={onChange}>
            <SelectTrigger className="w-full border border-bluePrimary">
                <SelectValue placeholder={value?.toString()} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem key="leasing" value="leasing">En Cours</SelectItem>
                <SelectItem value="bank">Facture</SelectItem>
                <SelectItem value="comptant">Annuler</SelectItem>
            </SelectContent>
        </Select>

    );
};

export default StatusDevisDropDown;
